/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */
import * as collection from '@laufire/utils/collection';
import base from './base';
import dev from './dev';
import prod from './prod';

describe('config', () => {
	const expectations = [
		['prod', prod],
		['dev', dev],
		[null, prod],
	];

	test.each(expectations)('query param env impacts the config',
		(env, envConfig) => {
			jest.isolateModules(() => {
				const get = jest.fn().mockReturnValue(env);
				const merged = Symbol('merged');

				jest.spyOn(global, 'URLSearchParams')
					.mockImplementation(() => ({ get }));
				jest.spyOn(collection, 'merge')
					.mockImplementation(() => merged);

				const config = require('./index').default;

				expect(get).toHaveBeenCalledWith('env');
				expect(collection.merge).toHaveBeenCalledWith(base, envConfig);
				expect(global.URLSearchParams)
					// eslint-disable-next-line no-undef
					.toHaveBeenCalledWith(window.location.search);
				expect(config).toEqual(merged);
			});
		});
});
