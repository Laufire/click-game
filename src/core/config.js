import mosquitoImage from '../image/mosquito.png';
import antImage from '../image/ant.png';
import bombImage from '../image/bomb.png';
import spiderImage from '../image/spider.png';

const ms = 1000;
const delay = 1.25;

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
		},
		ant: {
			score: 5,
			image: antImage,
			height: 5,
			width: 10,
			lives: 1,
		},
		spider: {
			score: 10,
			image: spiderImage,
			height: 2.5,
			width: 5,
			lives: 3,
		},
	},
	maxPowers: 1,
	powers: {
		bomb: {
			minimum: 1,
			maximum: 3,
			image: bombImage,
			height: 7,
			width: 7,
			addProbability: 0.2,
			removeProbability: 0.5,
		},
	},
};

export default config;
