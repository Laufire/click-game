/* eslint-disable max-lines-per-function */

import * as random from '@laufire/utils/random';
import { keys } from '@laufire/utils/lib';
import config from '../core/config';
import { getRandomX, getRandomY, project } from './positionService';
import PowerManager from './powerManager';
import TargetManager from './targetManager';

describe('PositionService', () => {
	const twentyFive = 25;
	const hundred = 100;
	const two = 2;

	test('getRandomX delegates positioning to rndBetween', () => {
		const widthRange = random.rndBetween(twentyFive, hundred);
		const min = widthRange / two;
		const max = hundred - min;
		const mockValue = Symbol('mock');

		jest.spyOn(random, 'rndBetween').mockReturnValue(mockValue);

		const result = getRandomX({ width: widthRange });

		expect(random.rndBetween).toHaveBeenCalledWith(min, max);
		expect(result).toEqual(mockValue);
	});

	test('getRandomY delegates positioning to rndBetween', () => {
		const heightRange = random.rndBetween(twentyFive, hundred);
		const min = heightRange / two;
		const max = hundred - min;
		const mockValue = Symbol('mock');

		jest.spyOn(random, 'rndBetween').mockReturnValue(mockValue);

		const result = getRandomY({ height: heightRange });

		expect(random.rndBetween).toHaveBeenCalledWith(min, max);
		expect(result).toEqual(mockValue);
	});

	test('project returns the adjusted position', () => {
		const type = random.rndValue(keys(config.powers));
		const power = PowerManager.getPower({ type });
		const target = TargetManager.getTarget();
		const position = random.rndValue([power, target]);
		const { x, y, width, height } = position;

		const result = project(position);

		expect(result).toMatchObject({
			...position,
			x: x - (width / two),
			y: y - (height / two),
		});
	});
});
