import { rndBetween, rndValue, rndString } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../core/config';
import TargetManager from './targetManager';

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
	const typeConfig = config.powers[type || rndValue(powerKeys)];

	return {
		id: rndString(eight),
		x: getRandomX(typeConfig),
		y: getRandomY(typeConfig),
		...typeConfig,
	};
};

const getPowers = () => powerKeys.map((type) =>
	rndBetween(1,
		1 / config.powers[type].probabilities.add) === 1
		&& getPower({ type })).filter((value) => value);

const addPower = (powers) =>	powers.concat(getPowers());

const removePowers = (data) =>
	rndBetween(1, 1 / data.probabilities.remove) === 1;

const removePower = (powers) => powers.filter((data) =>
	!removePowers(data));

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
