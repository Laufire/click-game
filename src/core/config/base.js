import mosquitoImage from '../../image/mosquito.png';
import antImage from '../../image/ant.png';
import bombImage from '../../image/bomb.png';
import spiderImage from '../../image/spider.png';
import iceImage from '../../image/ice.png';
import butterflyImage from '../../image/butterfly.png';
import balloon from '../../image/balloon.png';
import gift from '../../image/gift.png';
import spoiler from '../../image/spoiler.png';
import flyswatter from '../../image/flyswatter.png';
import shield from '../../image/shield.png';
import nuke from '../../image/nuke.png';
import twox from '../../image/double.png';
import repellent from '../../image/repellent.png';

const ms = 1000;
const delay = 2;

const config = {
	tickerDelay: ms * delay,
	idLength: 8,
	maxHealth: 100,
	maxTargets: 5,
	swatDamage: 1,
	penalDamage: 1,

	healthBar: {
		interval: 25,
		colors: {
			100: 'lightgreen',
			75: 'lightgreen',
			50: 'yellow',
			25: 'yellow',
			0: 'orangered',
		},
	},

	targets: {
		mosquito: {
			type: 'mosquito',
			score: 1,
			image: mosquitoImage,
			height: 10,
			width: 20,
			variance: 0.2,
			lifespan: 10,
			health: 1,
			damage: 1,
			speed: 8,
			prob: {
				spawn: 1,
				fertility: 1,
				attack: 0.5,
				drop: 1,
			},
		},
		ant: {
			type: 'ant',
			score: 5,
			image: antImage,
			height: 5,
			width: 10,
			variance: 0.5,
			lifespan: 5,
			health: 1,
			damage: 1,
			speed: 5,
			prob: {
				spawn: 1,
				fertility: 1,
				attack: 0.5,
				drop: 0.5,
			},
		},
		spider: {
			type: 'spider',
			score: 10,
			image: spiderImage,
			height: 5,
			width: 10,
			variance: 0.2,
			lifespan: 5,
			damage: 1,
			health: 3,
			speed: 3,
			prob: {
				spawn: 1,
				fertility: 1,
				attack: 0.5,
				add: 1,
				drop: 0.5,
			},
		},
		butterfly: {
			type: 'butterfly',
			score: 0,
			image: butterflyImage,
			height: 10,
			width: 10,
			variance: 0.3,
			lifespan: 3,
			damage: 1,
			health: 1,
			speed: 7,
			prob: {
				spawn: 1,
				fertility: 1,
				attack: 0.5,
				drop: 0.5,
			},
		},
		spoiler: {
			type: 'spoiler',
			image: spoiler,
			height: 7,
			width: 10,
			variance: 0.3,
			lifespan: 5,
			damage: 1,
			health: 1,
			score: 0,
			speed: 10,
			prob: {
				spawn: 1,
				fertility: 1,
				attack: 0.5,
				drop: 0.5,
			},
			effect: {
				score: {
					min: 1,
					max: 3,
				},
			},
		},
	},

	powers: {
		bomb: {
			type: 'bomb',
			image: bombImage,
			height: 7,
			width: 7,
			variance: 0.3,
			prob: {
				add: 1,
				remove: 1,
			},
			effect: {
				targetsCount: 3,
				damage: {
					min: 1,
					max: 3,
				},
			},
		},
		ice: {
			type: 'ice',
			image: iceImage,
			height: 10,
			width: 10,
			variance: 0.2,
			prob: {
				add: 1,
				remove: 1,
			},
			duration: 5,
		},
		surprise: {
			type: 'surprise',
			image: balloon,
			height: 7,
			variance: 0.3,
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
			variance: 0.3,
			width: 5,
			prob: {
				add: 1,
				remove: 1,
			},
			effect: {
				health: 1,
				score: {
					min: 5,
					max: 10,
				},
			},
		},
		superBat: {
			type: 'superBat',
			image: flyswatter,
			height: 10,
			width: 10,
			variance: 0.3,
			duration: 5,
			prob: {
				add: 1,
				remove: 1,
			},
			effect: {
				swatDamage: 10,
			},
		},
		shield: {
			type: 'shield',
			image: shield,
			height: 7,
			width: 7,
			variance: 0.2,
			prob: {
				add: 1,
				remove: 1,
			},
			duration: 5,
		},
		nuke: {
			type: 'nuke',
			image: nuke,
			height: 5,
			width: 5,
			variance: 0.3,
			prob: {
				add: 1,
				remove: 1,
			},
			effect: {
				damage: 10,
			},
		},
		double: {
			type: 'double',
			image: twox,
			height: 10,
			width: 10,
			variance: 0.3,
			duration: 15,
			prob: {
				add: 1,
				remove: 1,
			},
			effect: {
				multiplier: 2,
			},
		},
		repellent: {
			type: 'repellent',
			image: repellent,
			height: 7,
			width: 10,
			variance: 0.3,
			duration: 15,
			prob: {
				add: 1,
				remove: 1,
			},
		},
	},
};

export default config;
