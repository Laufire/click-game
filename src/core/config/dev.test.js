/* eslint-disable max-statements */

import * as collection from '@laufire/utils/collection';
import * as UrlService from '../../services/urlService';

describe('devConfig', () => {
	test('dev return merged config', () => {
		const merged = Symbol('merged');
		const paramValue = Symbol('paramValue');
		const parsed = Symbol('parsed');

		jest.spyOn(UrlService, 'getURLParam').mockReturnValue(paramValue);
		jest.spyOn(collection, 'merge').mockReturnValue(merged);
		jest.spyOn(JSON, 'parse').mockReturnValue(parsed);

		const result = require('./dev').default;

		expect(collection.merge)
			.toHaveBeenCalledWith(expect.any(Object), parsed);
		expect(UrlService.getURLParam).toHaveBeenCalledWith('config');
		expect(JSON.parse).toHaveBeenCalledWith(paramValue);
		expect(result).toEqual(merged);
	});
});
