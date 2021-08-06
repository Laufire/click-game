import { secure } from '@laufire/utils/collection';
import { rndValues } from '@laufire/utils/random';

const ant = secure({
	type: 'ant',
	id: '1234',
	lives: 1,
	score: 10,
});
const mosquito = secure({
	type: 'mosquito',
	id: '9876',
	lives: 1,
	score: 5,
});
const butterfly = secure({
	type: 'butterfly',
	id: '2468',
	lives: 1,
	score: 0,
});
const targets = secure([
	ant,
	mosquito,
	butterfly,
]);
const getRandomTargets = (count = 1) => rndValues(targets, count);

const Mocks = { ant, mosquito, butterfly, targets, getRandomTargets };

export default Mocks;
