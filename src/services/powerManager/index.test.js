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
import { keys, map, secure, shuffle } from '@laufire/utils/collection';
import context from '../../core/context';

describe('PowerManager', () => {
	const { adjustTime } = helper;

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
			jest.spyOn(random, 'rndBetween')
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

			expect(result).toEqual(expectedDamage);
		});
		test('geDamage returns normalbat when power is not active', () => {
			const expectedDamage = damage.normal;

			jest.spyOn(helper, 'isFuture')
				.mockImplementation(() => false);

			const result = PowerManager.getDamage({
				duration: { superBat },
			});

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

				expect(result).toEqual('normal');
			});

		test('getBatType returns super when superBat is active',
			() => {
				jest.spyOn(helper, 'isFuture')
					.mockImplementation(() => true);

				const result = PowerManager.getBatType({
					duration: { superBat },
				});

				expect(result).toEqual('super');
			});
	});

	describe('addPowers adds powers based on prob', () => {
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

		test('No powers added with 0 prob', () => {
			jest.spyOn(random, 'rndBetween')
				.mockImplementation(() => 0);

			const result = PowerManager.addPowers({ state: { powers }});

			expect(result).toEqual(powers);
		});

		test('Added powers with prob 1', () => {
			jest.spyOn(random, 'rndBetween')
				.mockImplementation(() => 1);

			const result = PowerManager
				.addPowers({ state: { powers: [] }});
			const resultKeys = result.map((item) => item.type);

			expect(resultKeys).toEqual(keys(config.powers));
		});
	});

	describe('getActivePowers', () => {
		const date = new Date();
		const [activePower, inactivePower]
			= shuffle(keys(context.seed.duration));
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
