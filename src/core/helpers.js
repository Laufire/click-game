import { filter } from '@laufire/utils/collection';
import config from './config';

const getTransientPowers = () =>
	filter(config.powers, (power) => power.duration);

export { getTransientPowers };
