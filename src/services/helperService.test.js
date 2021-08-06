/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
jest.mock('@laufire/utils/random');

import config from '../core/config';
import * as helper from './helperService';
import { rndString } from '@laufire/utils/random';

describe('HelperService', () => {
	describe('getId', () => {
		const { getId } = helper;

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

		test('isFuture returns true when input is less than new date',
			() => {
				const result = isFuture(adjustTime(
					new Date(), -4, 'hours'
				));

				expect(result).toEqual(true);
			});

		test('isFuture returns false when input is greater than new date',
			() => {
				const result = isFuture(adjustTime(
					new Date(), 4, 'hours'
				));

				expect(result).toEqual(false);
			});
	});
});
