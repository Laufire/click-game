/* eslint-disable max-lines-per-function */

import * as random from '@laufire/utils/random';
import { keys } from '@laufire/utils/lib';
import config from '../core/config';
import { getRandomX, getRandomY, project } from './positionService';
import PowerManager from './powerManager';
import TargetManager from './targetManager';

describe('PositionService', () => {
	test('getRandomX delegates positioning to rndBetween', () => {
		const widthRange = 50;
		const min = 25;
		const max = 75;
		const mockValue = Symbol('mock');

		jest.spyOn(random, 'rndBetween').mockReturnValue(mockValue);

		const result = getRandomX({ width: widthRange });

		expect(random.rndBetween).toHaveBeenCalledWith(min, max);
		expect(result).toEqual(mockValue);
	});

	test('getRandomY delegates positioning to rndBetween', () => {
		const heightRange = 50;
		const min = 25;
		const max = 75;
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
		const two = 2;

		const result = project(position);

		expect(result).toMatchObject({
			...position,
			x: x - (width / two),
			y: y - (height / two),
		});
	});
});
