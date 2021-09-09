/* eslint-disable max-lines-per-function */
import * as collection from '@laufire/utils/collection';
import base from './base';
import dev from './dev';
import prod from './prod';
import * as UrlService from '../../services/urlService';
import { keys } from '@laufire/utils/lib';

describe('devConfig', () => {
	const configs = {
		dev,
		prod,
	};
	const expectations = keys(configs);

	test.each(expectations)('dev return merged config', (config) => {
		jest.isolateModules(() => {
			const merged = Symbol('merged');

			jest.spyOn(UrlService, 'getURLParam')
				.mockReturnValue(config);
			jest.spyOn(collection, 'merge')
				.mockReturnValue(merged);

			const result = require('.').default;

			expect(collection.merge)
				.toHaveBeenCalledWith(base, configs[config]);
			expect(UrlService.getURLParam).toHaveBeenCalledWith('env');
			expect(result).toEqual(merged);
		});
	});
});
