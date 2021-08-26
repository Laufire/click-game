/* eslint-disable max-statements */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-import-assign */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */

import * as random from '@laufire/utils/random';
import config from '../../core/config';
import PowerManager from '../powerManager';
import { damage } from './data';
import Powers from './powers';
import * as helper from '../helperService';
import * as collection from '@laufire/utils/collection';
import TargetManager from '../targetManager';
import Mocks from '../../../test/mock';
import { getTransientPowers } from '../../core/helpers';

describe('PowerManager', () => {
	const { adjustTime } = helper;
	const { map, secure, shuffle } = collection;

	describe('getPower', () => {
		const { getPower } = PowerManager;
		const [type] = ['bomb'];
		const typeConfig = config.powers[type];
		const length = config.idLength;

		test('getPower bomb power', () => {
			const power = getPower({ type });

			expect(power).toMatchObject({
				id: expect.any(String),
				x: expect.any(Number),
				y: expect.any(Number),
				...typeConfig,
			});
			expect(power.id.length).toEqual(length);
		});
	});

	describe('test the removePowers', () => {
		const bomb = {
			id: 'abcd',
			type: 'bomb',
			prob: {
				remove: 0,
			},
		};
		const ice = {
			id: 'efgh',
			type: 'ice',
			prob: {
				remove: 0,
			},
		};
		const powers = [bomb, ice];

		test('test the removeExpiredPower with rndBetween', () => {
			jest.spyOn(helper, 'isProbable')
				.mockImplementation(() => 0);

			const result = PowerManager
				.removeExpiredPowers({ state: { powers }});

			expect(result).toEqual(powers);
		});

		test('removeExpiredPowers remove the powers', () => {
			const result = PowerManager
				.removeExpiredPowers({ state: { powers }});

			expect(result).toEqual(powers);
		});

		test('removePower remove the given power', () => {
			const data = ice;
			const result = PowerManager
				.removePower({ state: { powers }, data: data });

			expect(result).toEqual([bomb]);
		});

		test('activatePower activates the given power', () => {
			const returnValue = Symbol('returnValue');
			const state = Symbol('state');
			const type = 'bomb';
			const data = { type };

			jest.spyOn(Powers, type)
				.mockImplementation(() => returnValue);

			const powerHandler = Powers[type];

			const result = PowerManager.activatePower({ state, data });

			expect(powerHandler).toHaveBeenCalledWith(state);
			expect(result).toEqual(returnValue);
		});
	});

	describe('getDamage', () => {
		const superBat = new Date();

		test('geDamage returns superbat when power is active', () => {
			const expectedDamage = damage.super;

			jest.spyOn(helper, 'isFuture')
				.mockImplementation(() => true);

			const result = PowerManager
				.getDamage({
					duration: { superBat },
				});

			expect(helper.isFuture).toHaveBeenCalledWith(superBat);
			expect(result).toEqual(expectedDamage);
		});
		test('geDamage returns normalbat when power is not active', () => {
			const expectedDamage = damage.normal;

			jest.spyOn(helper, 'isFuture')
				.mockImplementation(() => false);

			const result = PowerManager.getDamage({
				duration: { superBat },
			});

			expect(helper.isFuture).toHaveBeenCalledWith(superBat);
			expect(result).toEqual(expectedDamage);
		});
	});
	describe('getBatType', () => {
		const superBat = new Date();

		test('getBatType returns normal when superBat is inactive',
			() => {
				jest.spyOn(helper, 'isFuture')
					.mockImplementation(() => false);

				const result = PowerManager.getBatType({
					duration: { superBat },
				});

				expect(helper.isFuture).toHaveBeenCalledWith(superBat);
				expect(result).toEqual('normal');
			});

		test('getBatType returns super when superBat is active',
			() => {
				jest.spyOn(helper, 'isFuture')
					.mockImplementation(() => true);

				const result = PowerManager.getBatType({
					duration: { superBat },
				});

				expect(helper.isFuture).toHaveBeenCalledWith(superBat);
				expect(result).toEqual('super');
			});
	});

	describe('addPowers', () => {
		// eslint-disable-next-line no-shadow
		const context = { state: { powers: [], targets: [] }};
		const expectedPowers = [Symbol('power')];
		const expectedDropCounts = 1;
		const expectedResult = Symbol('rndValues');

		test('adds powers based on drop prob', () => {
			jest.spyOn(random, 'rndValues')
				.mockImplementation(() => expectedResult);
			jest.spyOn(PowerManager, 'getPowers')
				.mockImplementation(() => expectedPowers);
			jest.spyOn(PowerManager, 'getDropCount')
				.mockImplementation(() => expectedDropCounts);

			const result = PowerManager.addPowers(context);

			expect(random.rndValues).toHaveBeenCalledWith([
				...context.state.powers,
				...expectedPowers,
			], expectedDropCounts,);
			expect(result).toEqual(expectedResult);
		});
	});

	test('getDropCount returns killed targets count based on drop prob', () => {
		const rndTargets = Mocks.getRandomTargets(2);
		// eslint-disable-next-line no-shadow
		const context = Symbol('context');

		const targetWithDrop = { ...rndTargets[0], prob: { drop: 1 }};
		const targetWithoutDrop = { ...rndTargets[1], prob: { drop: 1 }};
		const targets = [targetWithDrop, targetWithoutDrop];

		jest.spyOn(TargetManager, 'getKilledTargets')
			.mockImplementation(() => targets);
		jest.spyOn(helper, 'isProbable')
			.mockImplementation(() => true);

		const result = PowerManager.getDropCount(context);

		expect(TargetManager.getKilledTargets).toHaveBeenCalledWith(context);
		targets.map((target) => expect(helper.isProbable)
			.toHaveBeenCalledWith(target.prob.drop));
		expect(result).toEqual(2);
	});

	describe('getPowers', () => {
		test('getPowers returns powers based on add prob', () => {
			const power = Symbol('power');
			const expectedResult = collection.range(0, 9).map(() => power);

			jest.spyOn(helper, 'isProbable')
				.mockImplementation(() => true);
			jest.spyOn(PowerManager, 'getPower')
				.mockImplementation(() => power);

			const result = PowerManager.getPowers();

			collection.keys(config.powers).map((type) => {
				expect(helper.isProbable)
					.toHaveBeenCalledWith(config.powers[type].prob.add);
				expect(PowerManager.getPower)
					.toHaveBeenCalledWith({ type });
			});
			expect(result).toEqual(expectedResult);
		});

		test('getPowers returns no powers while prob is 0', () => {
			const expectedResult = [];

			jest.spyOn(helper, 'isProbable')
				.mockImplementation(() => false);

			const result = PowerManager.getPowers();

			collection.keys(config.powers).map((type) =>
				expect(helper.isProbable)
					.toHaveBeenCalledWith(config.powers[type].prob.add));
			expect(result).toEqual(expectedResult);
		});
	});

	describe('getActivePowers', () => {
		const date = new Date();
		const [activePower, inactivePower]
			= shuffle(collection.keys(getTransientPowers()));
		const adjustments = {
			[activePower]: 5,
			[inactivePower]: -5,
		};
		const state = {
			duration: secure(map(adjustments, (adjustment) => adjustTime(
				date, adjustment, 'hours'
			))),
		};

		test('getActivePowers returns a list of all active powers',
			() => {
				const result = PowerManager.getActivePowers({ state });
				const expected = [activePower];

				expect(result).toEqual(expected);
			});
	});

	describe('isActive', () => {
		const input = Symbol('Future');
		const power = 'ice';
		const state
		= { duration: { ice: 1 }};

		test('whether isFuture is called', () => {
			jest.spyOn(helper, 'isFuture')
				.mockImplementation(jest.fn(() => input));
			const result
				= PowerManager.isActive(state, power);

			expect(helper.isFuture).toHaveBeenCalledWith(state.duration[power]);
			expect(result).toEqual(input);
		});
	});
});
