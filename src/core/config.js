import mosquitoImage from '../image/mosquito.png';
import antImage from '../image/ant.png';
import bombImage from '../image/bomb.png';
import spiderImage from '../image/spider.png';
import iceImage from '../image/ice.png';

const ms = 1000;
const delay = 5;

const config = {
	tickerDelay: ms * delay,
	lives: 3,
	maxTargets: 5,
	targets: {
		mosquito: {
			score: 1,
			image: mosquitoImage,
			height: 10,
			width: 20,
			lives: 1,
			probabilities: {
				add: 0.2,
			},
		},
		ant: {
			score: 5,
			image: antImage,
			height: 5,
			width: 10,
			lives: 1,
			probabilities: {
				add: 0.6,
			},
		},
		spider: {
			score: 10,
			image: spiderImage,
			height: 2.5,
			width: 5,
			lives: 3,
			probabilities: {
				add: 0.2,
			},
		},
	},
	maxPowers: 1,
	powers: {
		bomb: {
			image: bombImage,
			height: 7,
			width: 7,
			targetsCount: {
				minimum: 1,
				maximum: 3,
			},
			power: {
				minimum: 1,
				maximum: 5,
			},
			probabilities: {
				add: 1,
				remove: 1,
			},
		},
		ice: {
			image: iceImage,
			height: 5,
			width: 5,
			probabilities: {
				add: 1,
				remove: 1,
			},
			frozenSeconds: {
				minimum: 2,
				maximum: 4,
			},
		},
	},
};

export default config;
