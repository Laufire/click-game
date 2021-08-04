import { range } from '@laufire/utils/collection';
import { unique } from '../../test/helpers';
import { getRandomX } from './positionService';

describe('PositionService', () => {
	test('getRandomX gives a rndBetween of width', () => {
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
});
