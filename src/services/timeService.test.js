jest.mock('moment');
import * as moment from 'moment';
import { adjustTime } from './timeService';

describe('adjustTime', () => {
	test('returns adjustedTime', () => {
		const adjustedTime = Symbol('adjustment');
		const adjustment = 4;
		const baseDate = Date.now();

		const momentSpy = jest.spyOn(moment, 'default')
			.mockReturnValue({ add: () => adjustedTime });

		const result = adjustTime(
			baseDate, adjustment, 'hours'
		);

		expect(momentSpy).toHaveBeenCalledWith(baseDate);
		expect(result).toEqual(adjustedTime);
	});
});
