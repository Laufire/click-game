import { rndBetween, rndValue } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../core/config';
import TargetManager from './targetManager';
import { getRandomX, getRandomY } from './positionService';
import { getRndString } from './helperService';

const powerKeys = keys(config.powers);

const getPower = ({ type } = {}) => {
	const typeConfig = config.powers[type || rndValue(powerKeys)];

	return {
		id: getRndString(),
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
		const { targetsCount } = config.powers.bomb;

		return {
			targets: TargetManager.decreaseTargetLives(
				state.targets, impactedTargets,
				rndBetween(targetsCount.min, targetsCount.max)
			),
		};
	},

	ice: (state) => {
		const { duration } = config.powers.ice;

		return {
			frozenTill:	state.frozenTill.add(rndBetween(duration.min,
				duration.max), 'seconds'),
		};
	},

	surprise: (state) => {
		const randomPower = rndValue(keys(setPower)
			.filter((data) => data !== 'surprise'));

		return setPower[randomPower](state);
	},

	gift: (state) => {
		const { score } = config.powers.gift;

		return rndBetween(0, 1)
			? { score: state.score + rndBetween(score.min, score.max) }
			: { lives: state.lives + 1 };
	},

	spoiler: (state) => {
		const { score } = config.powers.spoiler;

		return 	{ score: state.score - rndBetween(score.min, score.max) };
	},

	superBat: (state) => {
		const { duration } = config.powers.superBat;

		return {
			superTill: state.superTill.add(duration, 'seconds'),
		};
	},
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
