import { rndBetween, rndValue } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../../core/config';
import { getRandomX, getRandomY } from '../positionService';
import { getId } from '../helperService';
import setPower from './powers';
import moment from 'moment';

const powerKeys = keys(config.powers);

const getPower = ({ type } = {}) => {
	const typeConfig = config.powers[type || rndValue(powerKeys)];

	return {
		id: getId(),
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

const activatePower = (state, data) => setPower[data.type](state);

const removeActivatedPower = (powers, data) =>
	powers.filter((current) => current.id !== data.id);

const getBatType = ({ superTill }) => (
	superTill > moment() ? 'super' : 'normal');

const damage = {
	super: config.powers.superBat.swatDamage,
	normal: config.swatDamage,
};

const getDamage = (state) => damage[getBatType(state)];

const PowerManager = {
	getPower,
	addPowers,
	removePowers,
	activatePower,
	removeActivatedPower,
	getBatType,
	damage,
	getDamage,
};

export default PowerManager;
