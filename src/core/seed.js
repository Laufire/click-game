import config from './config';
import TargetManager from '../services/targetManager';

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
	lives: config.maxLives,
	duration: {
		// TODO: Auto populate the values.
		ice: timeZero,
		superBat: timeZero,
		shield: timeZero,
		double: timeZero,
	},
};

export default seed;
