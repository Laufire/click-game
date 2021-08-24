import config from './config';
import TargetManager from '../services/targetManager';
import { map } from '@laufire/utils/collection';
import { getTransientPowers } from './helpers';

const { getTarget } = TargetManager;
const timeZero = new Date();

const seed = {
	targets: [
		getTarget({
			x: 50,
			y: 50,
		}),
	],
	powers: [],
	score: 0,
	health: config.maxHealth,
	duration: { ...map(getTransientPowers(), () => timeZero) },
};

export default seed;
