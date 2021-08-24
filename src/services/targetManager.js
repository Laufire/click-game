import config from '../core/config';
import { rndBetween, rndValue } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import { getRandomX, getRandomY } from './positionService';
import { adjustTime, getId, getVariance, isFuture } from './helperService';
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
		...typeConfig,
		...size,
		healthTill: adjustTime(
			currentTime, lifespan, 'seconds'
		),
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

const getTargets = () => targetTypeKeys.map((type) =>
	rndBetween(1, 1 / config.targets[type].prob.add) === 1
	&& getTarget({ type })).filter((val) => val);

const addTargets = ({ state: { targets }}) => (targets.length < maxTargets
	? targets.concat(getTargets())
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
	state.targets.filter((target) => !isFuture(target.healthTill));

const attackPlayer = (context) => PlayerManager.decreaseHealth({
	...context,
	data: context.state.targets.filter((target) =>
		rndBetween(1, 1 / target.prob.attack) === 1)
		.reduce((acc, target) => acc + target.damage, 0),
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
};

export default TargetManager;
