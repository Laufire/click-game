import config from '../../core/config';
import { rndValue } from '@laufire/utils/random';
import { keys, sort, values } from '@laufire/utils/collection';
import { truthy } from '@laufire/utils/predicates';
import { getRandomX, getRandomY } from '../positionService';
import { getId, getVariance,
	isFuture, isProbable } from '../helpers';
import PowerManager from '../powerManager';
import PlayerManager from '../playerManager';
import { adjustTime } from '../timeService';
import swatEffects from './swatEffects';
import { onProp, ascending } from '@laufire/utils/sorters';

const { maxTargets } = config;
const targetTypeKeys = keys(config.targets);

const TargetManager = {
	// eslint-disable-next-line max-lines-per-function
	getTarget: ({ x, y, type } = {}) => {
		const typeConfig = config.targets[type || rndValue(targetTypeKeys)];
		const variance = getVariance(typeConfig.variance);
		const lifespan = typeConfig.lifespan * variance;
		const currentTime = Date.now();
		const size = {
			height: typeConfig.height * variance,
			width: typeConfig.width * variance,
		};

		return {
			id: getId(),
			x: x !== undefined ? x : getRandomX(size),
			y: y !== undefined ? y : getRandomY(size),
			livesTill: adjustTime(
				currentTime, lifespan, 'seconds'
			),
			attackedAt: null,
			...typeConfig,
			...size,
		};
	},

	spawnTargets: () => targetTypeKeys.map((type) =>
		isProbable(config.targets[type].prob.spawn)
		&& TargetManager.getTarget({ type })).filter(truthy),

	reproduceTargets: (targets) => targets.map((target) =>
		isProbable(config.targets[target.type].prob.fertility)
		&& TargetManager.getTarget({ type: target.type }))
		.filter(truthy),

	addTargets: ({ state: { targets }}) => (targets.length < maxTargets
		? [
			...targets,
			...TargetManager.spawnTargets(),
			...TargetManager.reproduceTargets(targets),
		]
		: targets),

	moveTargets: ({ state }) =>
		(PowerManager.isActive(state, 'ice')
			? state.targets
			: state.targets.map((target) => ({
				...target,
				x: getRandomX(target),
				y: getRandomY(target),
			}))),

	removeTargets: ({ state: { targets }, data: targetsToRemove }) =>
		targets.filter((target) => !targetsToRemove.includes(target)),

	// eslint-disable-next-line max-lines-per-function
	getTargetsScore: ({ state, data: targets }) => {
		const sortedTargets = sort(targets, onProp('attackedAt', ascending));
		const index = {};

		sortedTargets.forEach((target) => (index[target.attackedAt] = [
			...index[target.attackedAt] || [],
			target,
		]));

		const events = values(index).sort((a, b) =>
			a[0].attackedAt - b[0].attackedAt);

		let score = 0;
		const two = 2;

		const multipliers = { ...state.multipliers };

		targetTypeKeys.forEach((type) => {
			let multiplier = multipliers[type];

			events.forEach((event) => {
				const targetCount = event.filter((target) =>
					target.type === type).length;
				const termial = (n) => n * (n + 1) / two;
				const targetScore = config.targets[type].score;

				score += targetScore * ((multiplier * targetCount)
					+ termial(targetCount));
				multiplier = targetCount
					? multipliers[type] = multiplier + targetCount
					: multipliers[type] = 0;
			});
		});
		return { score, multipliers };
	},

	isDead: (target) => target.health <= 0 || !isFuture(target.livesTill),

	decreaseTargetHealth: (
		targets, impactedTargets, damage
	) => {
		const impactedTargetIDs = impactedTargets
			.map((impactedTarget) => impactedTarget.id);
		const attackedAt = Date.now();

		return 	targets.map((target) =>
			(impactedTargetIDs.includes(target.id)
				&& !TargetManager.isDead(target)
				? {
					...target,
					health: Math.max(target.health - damage, 0),
					attackedAt: attackedAt,
				}
				: target));
	},

	getKilledTargets: ({ state: { targets }}) =>
		targets.filter((target) => target.health <= 0),

	actuateEffect: ({ state, data }) =>
		(swatEffects[data.type] ? swatEffects[data.type](state, data) : {}),

	swatTarget: ({ state, data }) => ({
		...TargetManager.actuateEffect({ state, data }),
		targets: TargetManager.decreaseTargetHealth(
			state.targets, [data], PowerManager.getDamage(state)
		),
	}),

	getExpiredTargets: ({ state }) =>
		state.targets.filter((target) => !isFuture(target.livesTill)),

	attackPlayer: (context) => PlayerManager.decreaseHealth({
		...context,
		data: context.state.targets.filter((target) => {
			const variance = getVariance(target.variance);
			const attackProb = target.prob.attack * variance;

			return isProbable(attackProb);
		}).reduce((acc, target) => acc + target.damage, 0),
	}),
};

export default TargetManager;
