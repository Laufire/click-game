/* eslint-disable no-import-assign */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */

import * as random from '@laufire/utils/random';
import config from '../../core/config';
import { adjustTime } from '../helperService';
import PowerManager from '../powerManager';
import { damage } from './data';
import Powers from './powers';

beforeEach(() => {
	jest.clearAllMocks();
});

describe('PowerManager', () => {
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
				.mockImplementation(jest.fn(() => 0));

			const result = PowerManager.removeExpiredPowers(powers);

			expect(result).toEqual(powers);
		});

		test('removeExpiredPowers remove the powers', () => {
			const result = PowerManager.removeExpiredPowers(powers);

			expect(result).toEqual(powers);
		});

		test('removePower remove the given power', () => {
			const data = ice;
			const result = PowerManager.removePower(powers, data);

			expect(result).toEqual([bomb]);
		});

		test('activatePower activates the given power', () => {
			const returnValue = Symbol('returnValue');
			const state = Symbol('state');
			const type = 'bomb';
			const data = { type };

			jest.spyOn(Powers, type)
				.mockImplementation(jest.fn(() => returnValue));

			const powerHandler = Powers[type];

			const result = PowerManager.activatePower(state, data);

			expect(powerHandler).toHaveBeenCalledWith(state);
			expect(result).toEqual(returnValue);
		});

		describe('getDamage', () => {
			test('geDamage returns superbat when power is active', () => {
				const date = new Date();
				const adjustment = 5;
				const unit = 'seconds';

				const superTill = adjustTime(
					date, adjustment, unit
				);
				const expectedDamage = damage.super;
				const result = PowerManager
					.getDamage({ superTill });

				expect(result).toEqual(expectedDamage);
			});
			test('geDamage returns normalbat when power is not active', () => {
				const date = new Date();
				const adjustment = -5;
				const unit = 'seconds';

				const superTill = adjustTime(
					date, adjustment, unit
				);
				const expectedDamage = damage.normal;
				const result = PowerManager.getDamage({ superTill });

				expect(result).toEqual(expectedDamage);
			});
		});
		describe('getBatType', () => {
			test('getBatType returns super when the super is active', () => {
				const date = new Date();
				const adjustment = 5;
				const unit = 'seconds';

				const superTill = adjustTime(
					date, adjustment, unit
				);
				const expectedBatType = 'super';

				const result = PowerManager.getBatType({ superTill });

				expect(result).toEqual(expectedBatType);
			});

			test('getBatType returns normal the when super is inactive', () => {
				const date = new Date();
				const adjustment = -5;
				const unit = 'seconds';

				const superTill = adjustTime(
					date, adjustment, unit
				);
				const expectedBatType = 'normal';

				const result = PowerManager.getBatType({ superTill });

				expect(result).toEqual(expectedBatType);
			});
		});
	});
});
