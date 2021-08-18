/* eslint-disable no-magic-numbers */
import { secure } from '@laufire/utils/collection';
import { rndValues } from '@laufire/utils/random';
import { adjustTime } from '../src/services/helperService';

const ant = secure({
	type: 'ant',
	id: '1234',
	lives: 1,
	score: 10,
	livesTill: adjustTime(
		new Date(), 1000, 'seconds'
	),
});
const mosquito = secure({
	type: 'mosquito',
	id: '9876',
	lives: 1,
	score: 5,
	livesTill: adjustTime(
		new Date(), 1000, 'seconds'
	),
});
const butterfly = secure({
	type: 'butterfly',
	id: '2468',
	lives: 1,
	score: 0,
	livesTill: adjustTime(
		new Date(), -1000, 'seconds'
	),
});
const targets = secure([
	ant,
	mosquito,
	butterfly,
]);
const getRandomTargets = (count = 1) => rndValues(targets, count);

const Mocks = { ant, mosquito, butterfly, targets, getRandomTargets };

export default Mocks;
