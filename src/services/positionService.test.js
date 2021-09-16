/* eslint-disable max-nested-callbacks */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import * as random from '@laufire/utils/random';
import { keys, rndBetween } from '@laufire/utils/lib';
import config from '../core/config';
import { getPosition, getRandomX,
	getRandomY, project } from './positionService';
import PowerManager from './powerManager';
import TargetManager from './targetManager';
import { values } from '@laufire/utils/collection';
import { retry } from '../../test/helpers';
import { unique } from '@laufire/utils/predicates';

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

	describe('getPosition', () => {
		test('getPosition returns the new position', () => {
			const width = 2;
			const height = 2;
			const xMargin = width / two;
			const yMargin = height / two;

			const compute = () => {
				const x = rndBetween(xMargin, hundred - xMargin);
				const y = rndBetween(yMargin, hundred - yMargin);
				const speed = rndBetween(two, two);
				const target = { x, y, height, width, speed };

				const results = retry(() => getPosition(target), hundred);
				const xValues = results.map((item) => item.x).filter(unique);
				const yValues = results.map((item) => item.y).filter(unique);

				const position = getPosition(target);

				expect(xValues.length)
					.toBeGreaterThanOrEqual(speed + 1)
					.toBeLessThanOrEqual((two * speed) + 1);
				expect(yValues.length)
					.toBeGreaterThanOrEqual(speed + 1)
					.toBeLessThanOrEqual((two * speed) + 1);
				expect(position.x)
					.toBeGreaterThanOrEqual(xMargin)
					.toBeLessThanOrEqual(hundred - xMargin)
					.toBeGreaterThanOrEqual(x - speed)
					.toBeLessThanOrEqual(x + speed);
				expect(position.y)
					.toBeGreaterThanOrEqual(yMargin)
					.toBeLessThanOrEqual(hundred - yMargin)
					.toBeGreaterThanOrEqual(y - speed)
					.toBeLessThanOrEqual(y + speed);
			};

			retry(compute, hundred);
		});
	});
});
