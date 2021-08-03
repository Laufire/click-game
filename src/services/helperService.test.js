import config from '../core/config';
import { getId } from './helperService';

describe('HelperService', () => {
	test('getId gives a rndString of config.idLength', () => {
		const result = getId();
		const length = config.idLength;

		expect(result).toEqual(expect.any(String));
		expect(result.length).toEqual(length);
	});
});
