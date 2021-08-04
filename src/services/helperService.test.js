/* eslint-disable max-nested-callbacks */
jest.mock('@laufire/utils/random');

import config from '../core/config';
import { getId } from './helperService';
import { rndString } from '@laufire/utils/random';

describe('HelperService', () => {
	test('getId gives a rndString of the configured idLength', () => {
		const mockValue = Symbol('mock');

		rndString.mockImplementation(() => mockValue);

		const result = getId();

		expect(rndString).toHaveBeenCalledWith(config.idLength);
		expect(result).toEqual(mockValue);
	});
});
