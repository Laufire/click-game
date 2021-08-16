/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
jest.mock('@laufire/utils/random');
jest.mock('moment');

import config from '../core/config';
import * as random from '@laufire/utils/random';
import * as moment from 'moment';

import * as helper from './helperService';
import { adjustDate } from '../../test/helpers';

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
		const { isFuture } = helper;

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

	describe('adjustTime', () => {
		const { adjustTime } = helper;

		test('returns adjustedTime', () => {
			const adjustment = Symbol('adjustment');
			const baseDate = new Date();
			const Fn = jest.fn();

			jest.spyOn(global, 'Date')
				.mockImplementation(Fn);
			const momentSpy = jest.spyOn(moment, 'default')
				.mockImplementation(() => ({ add: () => adjustment }));

			const result = adjustTime(
				baseDate, 4, 'hours'
			);

			expect(momentSpy).toHaveBeenCalledWith(baseDate);
			expect(Date).toHaveBeenCalledWith(adjustment);
			expect(result).toEqual(Fn.mock.instances[0]);
		});
	});
});
