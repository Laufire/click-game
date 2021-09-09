/* eslint-disable max-lines-per-function */

import config from '../core/config';
import * as random from '@laufire/utils/random';
import { isEqual } from '@laufire/utils/predicates';
import * as helpers from './helpers';
import { isAcceptable, retry } from '../../test/helpers';
import { range } from '@laufire/utils/collection';

describe('helpers', () => {
	const { getId, isFuture, getVariance } = helpers;
	const hundred = 100;
	const two = 2;

	describe('getId', () => {
		test('getId gives a rndString of the configured idLength', () => {
			const returnValue = Symbol('mock');

			jest.spyOn(random, 'rndString')
				.mockReturnValue(returnValue);

			const result = getId();

			expect(random.rndString).toHaveBeenCalledWith(config.idLength);
			expect(result).toEqual(returnValue);
		});
	});

	describe('isFuture', () => {
		const msPerDay = 86400000;
		const expectations = [
			['past', false, Date.now() - msPerDay],
			['future', true, Date.now() + msPerDay],
		];

		test.each(expectations)('when input date is in the %p than'
			+ 'new date isFuture returns %p ',
		(
			dummy, expectation, value
		) =>
			expect(isFuture(value)).toEqual(expectation));
	});

	describe('getVariance', () => {
		const ten = 10;
		const returnValue = random.rndBetween(1, hundred);
		const variance = random.rndBetween(0, ten) / ten;
		const minimum = hundred - (variance * hundred);
		const maximum = hundred + (variance * hundred);

		test('returns a random number between variance range', () => {
			jest.spyOn(random, 'rndBetween')
				.mockReturnValue(returnValue);
			const { rndBetween } = random;
			const result = getVariance(variance);

			expect(rndBetween).toHaveBeenCalledWith(minimum, maximum);
			expect(result).toEqual(returnValue / hundred);
		});
	});

	test('isProbable true based on give probablility', () => {
		const retryCount = 100000;
		const errMargin = 0.08;
		const { isProbable } = helpers;
		const generateTest = (probability, errorMargin) => {
			const results = retry(() => isProbable(probability), retryCount);
			const successCount = results.filter(isEqual(true)).length;
			const expectedCount = Math.min(probability, 1) * retryCount;

			return isAcceptable(
				successCount, expectedCount, errorMargin
			);
		};
		const testValues = (values, margin) => {
			const results = values.map((probability) =>
				generateTest(probability, margin));
			const successCount = results.filter(isEqual(true)).length;

			expect(successCount).toEqual(results.length);
		};

		testValues([0, 1, two], 0);
		testValues(range(two, hundred - 1)
			.map((probability) => probability / hundred), errMargin);
	});
});
