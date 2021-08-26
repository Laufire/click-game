import config from './config';
import { map } from '@laufire/utils/collection';
import { getTransientPowers } from './helpers';

const timeZero = new Date();

const seed = {
	targets: [],
	powers: [],
	score: 0,
	health: config.maxHealth,
	duration: map(getTransientPowers(), () => timeZero),
};

export default seed;
