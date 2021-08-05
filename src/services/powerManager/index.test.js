/* eslint-disable no-import-assign */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */

import * as random from '@laufire/utils/random';
import config from '../../core/config';
import PowerManager from '../powerManager';

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
			random.rndBetween = jest.fn();
			random.rndBetween.mockImplementation(() => 0);

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
	});
});
