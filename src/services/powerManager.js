import { rndBetween, rndValue, rndString } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../core/config';
import TargetManager from './targetManager';
import { getRandomX, getRandomY } from './positionService';

const eight = 8;
const powerKeys = keys(config.powers);
const { power } = config.powers.bomb;
const { duration } = config.powers.ice;

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
		1 / config.powers[type].prob.add) === 1
		&& getPower({ type })).filter((value) => value);

const addPowers = (powers) =>	powers.concat(getPowers());

const shouldRemovePower = (data) =>
	rndBetween(1, 1 / data.prob.remove) === 1;

const removePowers = (powers) => powers.filter((data) =>
	!shouldRemovePower(data));

const setPower = {
	bomb: (state) => {
		const impactedTargets = TargetManager.getRandomTargets(state.targets);

		return {
			targets: TargetManager.decreaseTargetLives(
				state.targets, impactedTargets,
				rndBetween(power.min, power.max)
			),
		};
	},
	ice: (state) => ({
		frozenTill:	state.frozenTill.add(rndBetween(duration.min,
			duration.max), 'seconds'),
	}),
};

const activatePower = (state, data) => setPower[data.type](state);

const removeActivatedPower = (powers, data) =>
	powers.filter((current) => current.id !== data.id);

const PowerManager = {
	getPower,
	addPowers,
	removePowers,
	activatePower,
	removeActivatedPower,
};

export default PowerManager;
