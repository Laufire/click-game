/* eslint-disable max-len */
/* eslint-disable max-statements */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
jest.mock('moment');

import config from '../core/config';
import * as random from '@laufire/utils/random';
import { isEqual } from '@laufire/utils/predicates';
import * as moment from 'moment';

import * as helper from './helperService';
import { adjustDate, isAcceptable, retry } from '../../test/helpers';
import { range } from '@laufire/utils/collection';

describe('HelperService', () => {
	const { getId, isFuture, getVariance, adjustTime } = helper;

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
		test('isFuture returns false when input date is less than new date',
			() => {
				const result = isFuture(adjustDate(new Date(), -1));

				expect(result).toEqual(false);
			});

		test('isFuture returns true when input date is greater than new date',
			() => {
				const result = isFuture(adjustDate(new Date(), 1));

				expect(result).toEqual(true);
			});
	});

	describe('getVariance', () => {
		const input = 100;

		test('returns a random number between variance range', () => {
			jest.spyOn(random, 'rndBetween')
				.mockReturnValue(input);
			const { rndBetween } = random;
			const result = getVariance(0.2);

			expect(result).toEqual(input / 100);
			expect(rndBetween).toHaveBeenCalledWith(80, 120);
		});
	});

	describe('adjustTime', () => {
		test('returns adjustedTime', () => {
			const adjustment = Symbol('adjustment');
			const baseDate = new Date();
			const Fn = jest.fn();

			jest.spyOn(global, 'Date')
				.mockImplementation(Fn);
			const momentSpy = jest.spyOn(moment, 'default')
				.mockReturnValue({ add: () => adjustment });

			const result = adjustTime(
				baseDate, 4, 'hours'
			);

			expect(momentSpy).toHaveBeenCalledWith(baseDate);
			expect(Date).toHaveBeenCalledWith(adjustment);
			expect(result).toEqual(Fn.mock.instances[0]);
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

			expect(isAcceptable(
				successCount, results.length, 0.15
			)).toEqual(true);
		};

		testValues([0, 1, 2], 0);
		testValues(range(2, 99).map((probability) => probability / 100), 0.15);
	});
});
