import config from '../core/config';
import { rndBetween, rndValue } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import { truthy } from '@laufire/utils/predicates';
import { getRandomX, getRandomY } from './positionService';
import { adjustTime,	getId, getVariance,
	isFuture, isProbable } from './helperService';
import PowerManager from './powerManager';
import PlayerManager from './playerManager';

const { maxTargets } = config;
const targetTypeKeys = keys(config.targets);

const getTarget = ({ x, y, type } = {}) => {
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
		...typeConfig,
		...size,
	};
};

const moveTargets = ({ state }) =>
	(PowerManager.isActive(state, 'ice')
		? state.targets
		: state.targets.map((target) => ({
			...target,
			x: getRandomX(target),
			y: getRandomY(target),
		})));

const spawnTargets = () => targetTypeKeys.map((type) =>
	isProbable(config.targets[type].prob.spawn)
	&& getTarget({ type })).filter(truthy);

const reproduceTargets = (targets) => targets.map((target) =>
	isProbable(config.targets[target.type].prob.fertility)
	&& getTarget({ type: target.type }))
	.filter(truthy);

const addTargets = ({ state: { targets }}) => (targets.length < maxTargets
	? [
		...targets,
		// eslint-disable-next-line no-use-before-define
		...TargetManager.spawnTargets(),
		// eslint-disable-next-line no-use-before-define
		...TargetManager.reproduceTargets(targets),
	]
	: targets);

const removeTargets = ({ state: { targets }, data: targetsToRemove }) =>
	targets.filter((target) => !targetsToRemove.includes(target));

const getTargetsScore = ({ data: targets }) =>
	targets.reduce((acc, target) => acc + target.score, 0);

const decreaseTargetHealth = (
	targets, impactedTargets, damage
) => {
	const dataId = impactedTargets.map((impactedTarget) => impactedTarget.id);

	return 	targets.map((target) =>
		(dataId.includes(target.id)
			? {
				...target,
				health: Math.max(target.health - damage, 0),
			}
			: target));
};

const getKilledTargets = ({ state: { targets }}) =>
	targets.filter((target) => target.health <= 0);

// TODO: Extract this into a separate module.
const swatEffects = {
	butterfly: (state) => ({
		health: state.health - 1,
	}),
	spoiler: (state, data) => ({
		score: PlayerManager.adjustScore(state,
			-rndBetween(data.effect.score.min, data.effect.score.max)),
	}),
};

const swatTarget = ({ state, data }) => ({
	...swatEffects[data.type] && swatEffects[data.type](state, data),
	// eslint-disable-next-line no-use-before-define
	targets: TargetManager.decreaseTargetHealth(
		state.targets, [data], PowerManager.getDamage(state)
	),
});

const getExpiredTargets = ({ state }) =>
	state.targets.filter((target) => !isFuture(target.livesTill));

const attackPlayer = (context) => PlayerManager.decreaseHealth({
	...context,
	data: context.state.targets.filter((target) => {
		const variance = getVariance(target.variance);
		const attackProb = target.prob.attack * variance;

		return isProbable(attackProb);
	}).reduce((acc, target) => acc + target.damage, 0),
});

const TargetManager = {
	moveTargets,
	addTargets,
	getTarget,
	removeTargets,
	getTargetsScore,
	decreaseTargetHealth,
	getKilledTargets,
	swatTarget,
	getExpiredTargets,
	attackPlayer,
	spawnTargets,
	reproduceTargets,
};

export default TargetManager;
