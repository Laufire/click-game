import { rndBetween, rndValue, rndString } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../core/config';
import TargetManager from './targetManager';
import { peek } from '@laufire/utils/debug';

const hundred = 100;
const two = 2;
const eight = 8;
const powerKeys = keys(config.powers);
const { power } = config.powers.bomb;
const { frozenSeconds } = config.powers.ice;

const getRandomX = ({ width }) =>
	rndBetween(width / two, hundred - (width / two));

const getRandomY = ({ height }) =>
	rndBetween(height / two, hundred - (height / two));

const getPower = ({ type } = {}) => {
	const typeConfig = peek(config.powers[type || rndValue(powerKeys)]);

	return {
		id: rndString(eight),
		x: getRandomX(typeConfig),
		y: getRandomY(typeConfig),
		...typeConfig,
	};
};

const addPower = (powers) => powerKeys.map((data) => {
	const type = config.powers[data];

	return peek(rndBetween(1,
		1 / peek(type.probabilities.add)) === 1 && peek(powers.length) === 0)
		? powers.concat(peek(getPower(type)))
		: powers;
});

const removePower = (powers) => powerKeys.map((data) => {
	const type = config.powers[data];

	return rndBetween(1, 1 / type.probabilities.remove) === 1
	&& powers.length === 1
		? []
		: powers;
});

const setPower = {
	bomb: (state) => {
		const impactedTargets = TargetManager.getRandomTargets(state.targets);

		return { targets:
			TargetManager.decreaseTargetLives(
				state.targets, impactedTargets,
				rndBetween(power.minimum, power.maximum)
			),
		score: state.score + TargetManager.getTargetsScore(impactedTargets) };
	},
	ice: (state) => ({
		frozenTill:	state.frozenTill.add(rndBetween(frozenSeconds.minimum,
			frozenSeconds.maximum), 'seconds'),
	}),
};

const activatePower = (state, data) => setPower[data.type](state);

const removeActivatedPower = (powers, data) =>
	powers.filter((current) => current.id !== data.id);

const PowerManager = {
	getPower,
	addPower,
	removePower,
	activatePower,
	removeActivatedPower,
};

export default PowerManager;
