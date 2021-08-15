/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
jest.mock('@laufire/utils/random');

import config from '../core/config';
import * as helper from './helperService';
import * as random from '@laufire/utils/random';

describe('HelperService', () => {
	describe('getId', () => {
		const { getId } = helper;
		const { rndString } = random;

		test('getId gives a rndString of the configured idLength', () => {
			const mockValue = Symbol('mock');

			rndString.mockImplementation(() => mockValue);

			const result = getId();

			expect(rndString).toHaveBeenCalledWith(config.idLength);
			expect(result).toEqual(mockValue);
		});
	});

	describe('isFuture', () => {
		const { isFuture, adjustTime } = helper;

		test('isFuture returns false when input date is less than new date',
			() => {
				const result = isFuture(adjustTime(
					new Date(), -4, 'hours'
				));

				expect(result).toEqual(false);
			});

		test('isFuture returns true when input date is greater than new date',
			() => {
				const result = isFuture(adjustTime(
					new Date(), 4, 'hours'
				));

				expect(result).toEqual(true);
			});
	});

	describe('getVariance', () => {
		const { getVariance } = helper;
		const input = 100;

		test('returns a random number between variance range', () => {
			jest.spyOn(random, 'rndBetween')
				.mockImplementation(() => input);
			const { rndBetween } = random;
			const result = getVariance(0.2);

			expect(result).toEqual(input / 100);
			expect(rndBetween).toHaveBeenCalledWith(80, 120);
		});
	});

	describe.skip('adjustTime', () => {
		const { adjustTime } = helper;

		test('returns adjustedTime', () => {
			const result = adjustTime(
				new Date(), 4, 'hours'
			);

			expect(result).toEqual(adjustTime(
				new Date(), 4, 'hours'
			));
		});
	});
});
