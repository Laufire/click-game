/* eslint-disable max-lines-per-function */
jest.mock('@laufire/utils/random');

import { rndBetween } from '@laufire/utils/random';
import { getRandomX, getRandomY } from './positionService';

describe('PositionService', () => {
	test('getRandomX delegates positioning to rndBetween', () => {
		const widthRange = 50;
		const min = 25;
		const max = 75;
		const mockValue = Symbol('mock');

		rndBetween.mockImplementation(() => mockValue);

		const result = getRandomX({ width: widthRange });

		expect(rndBetween).toHaveBeenCalledWith(min, max);
		expect(result).toEqual(mockValue);
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
