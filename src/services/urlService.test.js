/* eslint-disable max-lines-per-function */
import { getURLParam } from '../services/urlService';

describe('urlService', () => {
	const expectations = [
		['env', 'prod'],
		['config', '{}'],
	];

	test('getURLParam return param value from url',
		() => {
			const paramValue = Symbol('paramValue');
			const param = Symbol('param');
			const get = jest.fn().mockReturnValue(paramValue);

			jest.spyOn(global, 'URLSearchParams')
				.mockReturnValue({ get });

			const result = getURLParam(param);

			expect(get).toHaveBeenCalledWith(param);
			expect(result).toEqual(paramValue);
		});

	test.each(expectations)('getURLParam return default value',
		(param, expectedValue) => {
			const get = jest.fn().mockReturnValue(false);

			jest.spyOn(global, 'URLSearchParams')
				.mockReturnValue({ get });

			const result = getURLParam(param);

			expect(result).toEqual(expectedValue);
		});
});
