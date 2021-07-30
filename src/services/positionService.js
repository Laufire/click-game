import { rndBetween } from '@laufire/utils/random';

const hundred = 100;
const two = 2;

const getRandomX = ({ width }) =>
	rndBetween(width / two, hundred - (width / two));

const getRandomY = ({ height }) =>
	rndBetween(height / two, hundred - (height / two));

export { getRandomX, getRandomY };
