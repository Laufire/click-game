/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */

import config from '../core/config';
import * as random from '@laufire/utils/random';
import { isEqual } from '@laufire/utils/predicates';
import * as helper from './helperService';
import { isAcceptable, retry } from '../../test/helpers';
import { range } from '@laufire/utils/collection';

describe('HelperService', () => {
	const { getId, isFuture, getVariance } = helper;

	describe('getId', () => {
		test('getId gives a rndString of the configured idLength', () => {
			const mockValue = Symbol('mock');

			jest.spyOn(random, 'rndString')
				.mockReturnValue(mockValue);

			const result = getId();

			expect(random.rndString).toHaveBeenCalledWith(config.idLength);
			expect(result).toEqual(mockValue);
		});
	});

	describe('isFuture', () => {
		const msPerDay = 86400000;

		test('isFuture returns false when input date is less than new date',
			() => {
				const result = isFuture(Date.now() - msPerDay);

				expect(result).toEqual(false);
			});

		test('isFuture returns true when input date is greater than new date',
			() => {
				const result = isFuture(Date.now() + msPerDay);

				expect(result).toEqual(true);
			});
	});

	describe('getVariance', () => {
		const hundred = 100;
		const returnValue = random.rndBetween(1, hundred);
		const variance = random.rndBetween(0, 10) / 10;
		const minimum = hundred - (variance * hundred);
		const maximum = hundred + (variance * hundred);

		test('returns a random number between variance range', () => {
			jest.spyOn(random, 'rndBetween')
				.mockReturnValue(returnValue);
			const { rndBetween } = random;
			const result = getVariance(variance);

			expect(result).toEqual(returnValue / hundred);
			expect(rndBetween).toHaveBeenCalledWith(minimum, maximum);
		});
	});

	test('isProbable true based on give probablility', () => {
		const retryCount = 100000;
		const { isProbable } = helper;
		const generateTest = (probability, errorMargin) => {
			const results = retry(() => isProbable(probability), retryCount);
			const successCount = results.filter(isEqual(true)).length;
			const expectedCount = Math.min(probability, 1) * retryCount;

			return isAcceptable(
				successCount, expectedCount, errorMargin
			);
		};
		const testValues = (values, margin) => {
			const results = values.map((probability) =>	generateTest(probability, margin));
			const successCount = results.filter(isEqual(true)).length;

			expect(successCount).toEqual(results.length);
		};

		testValues([0, 1, 2], 0);
		testValues(range(2, 99).map((probability) => probability / 100), 0.05);
	});
});
