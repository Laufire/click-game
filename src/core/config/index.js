import base from './base';
import { merge } from '@laufire/utils/collection';
import dev from './dev';
import prod from './prod';

const getEnv = () =>
	// eslint-disable-next-line no-undef
	new URLSearchParams(window.location.search).get('env');

const configs = {
	dev,
	prod,
};

const config = merge(base, configs[getEnv() || 'prod']);

export default config;
