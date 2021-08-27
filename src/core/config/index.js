import base from './base';
import { merge } from '@laufire/utils/collection';
import dev from './dev';
import prod from './prod';
import { getURLParam } from '../../services/urlService';

const configs = {
	dev,
	prod,
};

const config = merge(base, configs[getURLParam('env')]);

export default config;
