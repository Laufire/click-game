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
	const { getId, isFuture, getVariance, adjustTime, isAlive } = helper;

	describe('getId', () => {
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
				.mockImplementation(() => input);
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
				.mockImplementation(() => ({ add: () => adjustment }));

			const result = adjustTime(
				baseDate, 4, 'hours'
			);

			expect(momentSpy).toHaveBeenCalledWith(baseDate);
			expect(Date).toHaveBeenCalledWith(adjustment);
			expect(result).toEqual(Fn.mock.instances[0]);
		});
	});

	describe('isAlive', () => {
		test('returns true if lives is equal to zero', () => {
			const context = {
				state: { lives: 0 },
			};

			const result = isAlive(context);

			expect(result).toEqual(true);
		});
		test('returns false if lives is greater than zero', () => {
			const context = {
				state: { lives: 3 },
			};

			const result = isAlive(context);

			expect(result).toEqual(false);
		});
	});
});
