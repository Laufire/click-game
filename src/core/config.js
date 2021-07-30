import mosquitoImage from '../image/mosquito.png';
import antImage from '../image/ant.png';
import bombImage from '../image/bomb.png';
import spiderImage from '../image/spider.png';
import iceImage from '../image/ice.png';
import butterflyImage from '../image/butterfly.png';

const ms = 1000;
const delay = 2;

const config = {
	tickerDelay: ms * delay,
	lives: 3,
	maxTargets: 5,
	targets: {
		mosquito: {
			type: 'mosquito',
			score: 1,
			image: mosquitoImage,
			height: 10,
			width: 20,
			variance: 1.5,
			lives: 1,
			prob: {
				add: 0.2,
			},
		},
		ant: {
			type: 'ant',
			score: 5,
			image: antImage,
			height: 5,
			width: 10,
			variance: 2,
			lives: 1,
			prob: {
				add: 0.6,
			},
		},
		spider: {
			type: 'spider',
			score: 10,
			image: spiderImage,
			height: 5,
			width: 10,
			variance: 3,
			lives: 3,
			prob: {
				add: 0.1,
			},
		},
		butterfly: {
			type: 'butterfly',
			score: 0,
			image: butterflyImage,
			height: 10,
			width: 10,
			variance: 2,
			lives: 1,
			prob: {
				add: 0.1,
			},
		},
	},
	maxPowers: 1,
	powers: {
		bomb: {
			type: 'bomb',
			image: bombImage,
			height: 7,
			width: 7,
			targetsCount: {
				min: 1,
				max: 3,
			},
			power: {
				min: 1,
				max: 5,
			},
			prob: {
				add: 1,
				remove: 1,
			},
		},
		ice: {
			type: 'ice',
			image: iceImage,
			height: 10,
			width: 10,
			prob: {
				add: 1,
				remove: 1,
			},
			duration: {
				min: 5,
				max: 7,
			},
		},
	},
};

export default config;
