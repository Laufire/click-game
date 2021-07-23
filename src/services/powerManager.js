import { rndBetween, rndValue, rndString } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../core/config';

const hundred = 100;
const two = 2;
const eight = 8;
const powerKeys = keys(config.powers);
const addValue = 1 / config.powers.bomb.addProbability;
const removeValue = 1 / config.powers.bomb.removeProbability;

const getRandomX = ({ width }) =>
	rndBetween(width / two, hundred - (width / two));

const getRandomY = ({ height }) =>
	rndBetween(height / two, hundred - (height / two));

const getPower = ({ x, y, type } = {}) => {
	const typeConfig = config.powers[type || rndValue(powerKeys)];

	return {
		id: rndString(eight),
		x: x !== undefined ? x : getRandomX(typeConfig),
		y: y !== undefined ? y : getRandomY(typeConfig),
		...typeConfig,
	};
};

const addPower = (powers) =>
	(rndBetween(1, addValue) === 1 && powers.length === 0
		? powers.concat(getPower())
		: powers);

const removePower = (powers) =>
	(powers.length === 1 && rndBetween(1, removeValue) === 1
		? []
		: powers);

const removeClickedPower = (powers, power) =>
	powers.filter((current) => current.id !== power.id);

const PowerManager = {
	getPower,
	addPower,
	removePower,
	removeClickedPower,
};

export default PowerManager;
