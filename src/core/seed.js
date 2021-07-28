import config from './config';
import TargetManager from '../services/targetManager';
import moment from 'moment';

const { getTarget } = TargetManager;

const seed = {
	targets: [
		getTarget({
			x: 50,
			y: 50,
		}),
	],
	powers: [],
	score: 0,
	lives: config.lives,
	frozenTill: moment(),
};

export default seed;
