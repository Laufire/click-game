/* eslint-disable max-lines-per-function */

import * as random from '@laufire/utils/random';
import { keys } from '@laufire/utils/lib';
import config from '../core/config';
import { getRandomX, getRandomY, project } from './positionService';
import PowerManager from './powerManager';
import TargetManager from './targetManager';
import { values } from '@laufire/utils/collection';

describe('PositionService', () => {
	const twentyFive = 25;
	const hundred = 100;
	const two = 2;

	const range = random.rndBetween(twentyFive, hundred);
	const expectations = [
		[getRandomX, { width: range }],
		[getRandomY, { height: range }],
	];

	test.each(expectations)('%p delegates positioning to rndBetween',
		(func, expectation) => {
			const min = values(expectation)[0] / two;
			const max = hundred - min;
			const expectedValue = Symbol('mock');

			jest.spyOn(random, 'rndBetween').mockReturnValue(expectedValue);

			const result = func(expectation);

			expect(random.rndBetween).toHaveBeenCalledWith(min, max);
			expect(result).toEqual(expectedValue);
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
