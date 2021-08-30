/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import { adjustTime } from './timeService';

describe('adjustTime', () => {
	test('returns adjustedTime', () => {
		const sixty = 60;
		const twentyFour = 24;
		const seconds = 1000;
		const minutes = sixty * seconds;
		const hours = sixty * minutes;
		const days = twentyFour * hours;

		const adjustment = 4;
		const baseDate = Date.now();

		const cases = [
			[baseDate, adjustment, 'days', baseDate + (adjustment * days)],
			[baseDate, adjustment, 'hours', baseDate + (adjustment * hours)],
			[baseDate, adjustment, 'minutes', baseDate + (adjustment * minutes)],
			[baseDate, adjustment, 'seconds', baseDate + (adjustment * seconds)],
		];

		cases.forEach(([dateValue, adjustValue, unit, expected]) => {
			const result = adjustTime(
				dateValue, adjustValue, unit
			);

			expect(result).toEqual(expected);
		});
	});
});
