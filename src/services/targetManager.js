import config from '../core/config';
import { rndBetween, rndString, rndValue } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import moment from 'moment';
import { getRandomX, getRandomY } from './positionService';

const eight = 8;
const hundred = 100;
const { maxTargets } = config;
const targetTypeKeys = keys(config.targets);
const { targetsCount } = config.powers.bomb;

const getTarget = ({ x, y, type } = {}) => {
	const typeConfig = config.targets[type || rndValue(targetTypeKeys)];
	const randomVariance = rndBetween(hundred - (typeConfig.variance * hundred),
		hundred + (typeConfig.variance * hundred)) / hundred;

	return {
		id: rndString(eight),
		height: `${ typeConfig.height * randomVariance }vw`,
		width: `${ typeConfig.width * randomVariance }vw`,
		x: x !== undefined ? x : getRandomX(typeConfig),
		y: y !== undefined ? y : getRandomY(typeConfig),
		...typeConfig,
	};
};

const moveTargets = ({ targets, frozenTill }) =>
	(moment() > frozenTill
		? targets.map((target) => ({
			...target,
			x: getRandomX(target),
			y: getRandomY(target),
		}))
		: targets);

const getTargets = () => targetTypeKeys.map((type) =>
	rndBetween(1, 1 / config.targets[type].prob.add) === 1
	&& getTarget({ type })).filter((val) => val);

const addTargets = (targets) => (targets.length < maxTargets
	? targets.concat(getTargets())
	: targets);

const removeTarget = (targets, target) =>
	targets.filter((current) => current.id !== target.id);

const getRandomTargets = (targets) => {
	const result = [];
	const count = Math.min(targetsCount.max, targets.length);

	while(result.length < count) {
		const i = rndBetween(0, targets.length - 1);

		if(!result.includes(targets[i]))
			result.push(targets[i]);
	}
	return result;
};

const removeTargets = (targets, targetsToRemove) =>
	targets.filter((target) => !targetsToRemove.includes(target));

const getTargetsScore = (targets) =>
	targets.reduce((acc, target) => acc + target.score, 0);

const decreaseTargetLives = (
	targets, impactedTargets, damage
) => {
	const dataId = impactedTargets.map((impactedTarget) => impactedTarget.id);

	return 	targets.map((target) =>
		(dataId.includes(target.id)
			? {
				...target,
				lives: Math.max(target.lives - damage, 0),
			}
			: target));
};

const getDeadTargets = (targets) =>
	targets.filter((target) => target.lives <= 0);

const getDamage = (state) => (state.superTill > moment()
	? config.powers.superBat.swatDamage
	: config.swatDamage);

const swatActions = {
	butterfly: (state, data) => ({
		lives: state.lives - 1,
		targets: decreaseTargetLives(
			state.targets, [data], getDamage(state)
		),
	}),
};

const swatActionDefault = (state, data) => ({
	targets: decreaseTargetLives(
		state.targets, [data], getDamage(state)
	),
});

const swatTarget = (state, data) =>
	(swatActions[data.type] || swatActionDefault)(state, data);

const TargetManager = {
	moveTargets,
	addTargets,
	getTarget,
	getTargets,
	removeTarget,
	removeTargets,
	getRandomTargets,
	getTargetsScore,
	decreaseTargetLives,
	getDeadTargets,
	swatTarget,
};

export default TargetManager;
