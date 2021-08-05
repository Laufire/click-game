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

		test('test the removePower with rndBetween', () => {
			random.rndBetween = jest.fn();
			random.rndBetween.mockImplementation(() => 0);

			const result = PowerManager.removePowers(powers);

			expect(result).toEqual(powers);
		});

		test('test the removePower without mock', () => {
			const result = PowerManager.removePowers(powers);

			expect(result).toEqual(powers);
		});

		test('test the removeActivatedPower without mock', () => {
			const data = ice;
			const result = PowerManager.removeActivatedPower(powers, data);

			expect(result).toEqual([bomb]);
		});
	});
});
