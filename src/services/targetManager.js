import config from '../core/config';
import { rndBetween, rndString, rndValue } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';

const hundred = 100;
const two = 100;
const eight = 8;
const { maxTargets, powers } = config;
const targetTypeKeys = keys(config.targets);

const getRandomX = ({ width }) =>
	rndBetween(width / two, hundred - (width / two));

const getRandomY = ({ height }) =>
	rndBetween(height / two, hundred - (height / two));

const getTarget = ({ x, y, type } = {}) => {
	const typeConfig = config.targets[type || rndValue(targetTypeKeys)];

	return {
		id: rndString(eight),
		x: x !== undefined ? x : getRandomX(typeConfig),
		y: y !== undefined ? y : getRandomY(typeConfig),
		...typeConfig,
	};
};

const moveTargets = (targets) => targets.map((target) => ({
	...target,
	x: getRandomX(target),
	y: getRandomY(target),
}));

const addTarget = (targets) => (targets.length < maxTargets
	? targets.concat(getTarget())
	: targets);

const removeTarget = (targets, target) =>
	targets.filter((current) => current.id !== target.id);

const getRandomTargets = (targets) => {
	const result = [];
	const count = Math.min(powers.bomb.maximum, targets.length);

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
	targets, current, damage
) =>
	targets.map((target) =>
		(target.id === current.id
			? {
				...current,
				lives: Math.max(current.lives - damage, 0),
			}
			: target));

const getDeadTargets = (targets) =>
	targets.filter((target) => target.lives <= 0);

const TargetManager = {
	moveTargets,
	addTarget,
	getTarget,
	removeTarget,
	removeTargets,
	getRandomTargets,
	getTargetsScore,
	decreaseTargetLives,
	getDeadTargets,
};

export default TargetManager;
