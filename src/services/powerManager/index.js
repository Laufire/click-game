/* eslint-disable no-use-before-define */
import { rndValues } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../../core/config';
import { getRandomX, getRandomY } from '../positionService';
import { getId, isFuture, isProbable } from '../helperService';
import Powers from './powers';
import { damage } from './data';
import TargetManager from '../targetManager';
import { truthy } from '@laufire/utils/predicates';

const powerKeys = keys(config.powers);

const getPower = ({ type }) => {
	const typeConfig = config.powers[type];

	return {
		id: getId(),
		x: getRandomX(typeConfig),
		y: getRandomY(typeConfig),
		...typeConfig,
	};
};

const getPowers = () => powerKeys.map((type) =>
	isProbable(config.powers[type].prob.add)
		&& PowerManager.getPower({ type })).filter(truthy);

const getDropCount = (context) => TargetManager.getKilledTargets(context)
	.filter((target) => isProbable(target.prob.drop)).length;

const addPowers = (context) =>
	rndValues([...context.state.powers, ...PowerManager.getPowers()],
		PowerManager.getDropCount(context));

const hasPowerExpired = (data) =>
	isProbable(data.prob.remove);

const removeExpiredPowers = ({ state: { powers }}) => powers.filter((data) =>
	!hasPowerExpired(data));

const activatePower = ({ state, data }) => Powers[data.type](state);

const removePower = ({ state: { powers }, data }) =>
	powers.filter((current) => current.id !== data.id);

const getActivePowers = ({ state }) => keys(state.duration)
	.filter((stateKey) => isFuture(state.duration[stateKey]));

const isActive = (state, power) => isFuture(state.duration[power]);

// TODO: Standardise the input parameter as Context.
const getBatType = (state) =>
	(isActive(state, 'superBat') ? 'super' : 'normal');

const getDamage = (state) => damage[getBatType(state)];

const PowerManager = {
	getPower,
	addPowers,
	removeExpiredPowers,
	activatePower,
	removePower,
	getBatType,
	getDamage,
	getActivePowers,
	isActive,
	getDropCount,
	getPowers,
};

export default PowerManager;
