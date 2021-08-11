/* eslint-disable max-lines-per-function */

import * as random from '@laufire/utils/random';
import { getRandomX, getRandomY } from './positionService';

describe('PositionService', () => {
	test('getRandomX delegates positioning to rndBetween', () => {
		const widthRange = 50;
		const min = 25;
		const max = 75;
		const mockValue = Symbol('mock');

		jest.spyOn(random, 'rndBetween').mockImplementation(() => mockValue);

		const result = getRandomX({ width: widthRange });

		expect(random.rndBetween).toHaveBeenCalledWith(min, max);
		expect(result).toEqual(mockValue);
	});

	test('getRandomY delegates positioning to rndBetween', () => {
		const heightRange = 50;
		const min = 25;
		const max = 75;
		const mockValue = Symbol('mock');

		jest.spyOn(random, 'rndBetween').mockImplementation(() => mockValue);

		const result = getRandomY({ height: heightRange });

		expect(random.rndBetween).toHaveBeenCalledWith(min, max);
		expect(result).toEqual(mockValue);
	});
});
