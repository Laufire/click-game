import { adjustTime } from './timeService';
import { keys } from '@laufire/utils/collection';

const sixty = 60;
const twentyFour = 24;
const seconds = 1000;
const minutes = sixty * seconds;
const hours = sixty * minutes;
const days = twentyFour * hours;
const adjustment = 4;
const baseDate = Date.now();

test('adjustTime returns adjustedTime', () => {
	const time = { days, hours, minutes, seconds };
	const cases = keys(time).map((val) =>
		[baseDate, adjustment, val, baseDate + (adjustment * time[val])]);

	cases.forEach(([dateValue, adjustValue, unit, expected]) => {
		const result = adjustTime(
			dateValue, adjustValue, unit
		);

		expect(result).toEqual(expected);
	});
});
