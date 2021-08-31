/* eslint-disable no-magic-numbers */
import { secure } from '@laufire/utils/collection';
import { rndValues } from '@laufire/utils/random';

const livesTill = Date.now();

const ant = secure({
	type: 'ant',
	id: '1234',
	health: 1,
	score: 10,
	livesTill: livesTill,
	damage: 1,
	variance: 0.2,
	prob: {
		attack: 1,
	},
	attackedAt: null,
});
const mosquito = secure({
	type: 'mosquito',
	id: '9876',
	health: 1,
	score: 5,
	livesTill: livesTill,
	damage: 1,
	variance: 0.2,
	prob: {
		attack: 1,
	},
	attackedAt: null,
});
const butterfly = secure({
	type: 'butterfly',
	id: '2468',
	health: 1,
	score: 0,
	livesTill: livesTill,
	damage: 1,
	variance: 0.2,
	prob: {
		attack: 1,
	},
	attackedAt: null,
});
const targets = secure([
	ant,
	mosquito,
	butterfly,
]);
const getRandomTargets = (count = 1) => rndValues(targets, count);

const Mocks = { ant, mosquito, butterfly, targets, getRandomTargets };

export default Mocks;
