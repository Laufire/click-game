/* eslint-disable max-lines-per-function */
jest.mock('@laufire/utils/random');

import { range } from '@laufire/utils/collection';
import { unique } from '../../test/helpers';
import { rndBetween } from '@laufire/utils/random';
import { getRandomX, getRandomY } from './positionService';

describe('PositionService', () => {
	test.skip('getRandomX gives a rndBetween of width', () => {
		const width = 50;
		const between = 1000;
		const expectedCorrectness = 0.8;

		const min = 25;
		const max = 75;
		const result = range(1, between).map(() => getRandomX({ width }));

		result.forEach((data) =>
			expect(data >= min && data <= max).toEqual(true));
		expect(unique(result).length)
			.toBeGreaterThan(width * expectedCorrectness);
	});

	test('getRandomY delegates positioning to rndBetween', () => {
		const heightRange = 50;
		const min = 25;
		const max = 75;
		const mockValue = Symbol('mock');

		rndBetween.mockImplementation(() => mockValue);

		const result = getRandomY({ height: heightRange });

		expect(rndBetween).toHaveBeenCalledWith(min, max);
		expect(result).toEqual(mockValue);
	});
});
