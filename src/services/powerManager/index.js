/* eslint-disable no-use-before-define */
import { rndValues } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../../core/config';
import { getRandomX, getRandomY } from '../positionService';
import { getId, isFuture, isProbable } from '../helpers';
import Powers from './powers';
import { damage } from './data';
import TargetManager from '../targetManager';
import { truthy } from '@laufire/utils/predicates';

const powerKeys = keys(config.powers);

const PowerManager = {
	getPower: ({ type }) => {
		const typeConfig = config.powers[type];

		return {
			id: getId(),
			x: getRandomX(typeConfig),
			y: getRandomY(typeConfig),
			...typeConfig,
		};
	},

	getPowers: () => powerKeys.map((type) =>
		isProbable(config.powers[type].prob.add)
		&& PowerManager.getPower({ type })).filter(truthy),

	getDropCount: (context) => TargetManager.getKilledTargets(context)
		.filter((target) => isProbable(target.prob.drop)).length,

	addPowers: (context) =>
		rndValues([...context.state.powers, ...PowerManager.getPowers()],
			PowerManager.getDropCount(context)),

	hasPowerExpired: (data) => isProbable(data.prob.remove),

	removeExpiredPowers: ({ state: { powers }}) => powers.filter((data) =>
		!PowerManager.hasPowerExpired(data)),

	activatePower: ({ state, data }) => Powers[data.type](state),

	removePower: ({ state: { powers }, data }) =>
		powers.filter((current) => current.id !== data.id),

	getActivePowers: ({ state }) => keys(state.duration)
		.filter((stateKey) => isFuture(state.duration[stateKey])),

	isActive: (state, power) => isFuture(state.duration[power]),

	// TODO: Standardise the input parameter as Context.
	getBatType: (state) =>
		(PowerManager.isActive(state, 'superBat') ? 'super' : 'normal'),

	getDamage: (state) => damage[PowerManager.getBatType(state)],
};

export default PowerManager;
