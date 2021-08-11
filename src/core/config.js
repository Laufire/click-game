import mosquitoImage from '../image/mosquito.png';
import antImage from '../image/ant.png';
import bombImage from '../image/bomb.png';
import spiderImage from '../image/spider.png';
import iceImage from '../image/ice.png';
import butterflyImage from '../image/butterfly.png';
import balloon from '../image/balloon.png';
import gift from '../image/gift.png';
import spoiler from '../image/spoiler.png';
import flyswatter from '../image/flyswatter.png';

const ms = 1000;
const delay = 2;

const config = {
	tickerDelay: ms * delay,
	idLength: 8,
	lives: 3,
	maxTargets: 5,
	swatDamage: 1,
	penalDamage: 1,
	targets: {
		mosquito: {
			type: 'mosquito',
			score: 1,
			image: mosquitoImage,
			height: 10,
			width: 20,
			variance: 0.2,
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
			variance: 0.5,
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
			variance: 0.2,
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
			variance: 0.3,
			lives: 1,
			prob: {
				add: 0.1,
			},
		},
		spoiler: {
			type: 'spoiler',
			image: spoiler,
			height: 7,
			width: 10,
			variance: 0.3,
			lives: 1,
			score: 0,
			prob: {
				add: 0.5,
			},
			effect: {
				score: {
					min: 1,
					max: 3,
				},
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
			targetsCount: 3,
			damage: {
				min: 1,
				max: 3,
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
		surprise: {
			type: 'surprise',
			image: balloon,
			height: 7,
			width: 4,
			prob: {
				add: 1,
				remove: 1,
			},
		},
		gift: {
			type: 'gift',
			image: gift,
			height: 5,
			width: 5,
			prob: {
				add: 1,
				remove: 1,
			},
			score: {
				min: 5,
				max: 10,
			},
			lives: 1,
		},
		superBat: {
			type: 'superBat',
			image: flyswatter,
			height: 10,
			width: 10,
			duration: 5,
			swatDamage: 10,
			prob: {
				add: 1,
				remove: 1,
			},
		},
	},
};

export default config;
