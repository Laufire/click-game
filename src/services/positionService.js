import { rndBetween } from '@laufire/utils/random';

const hundred = 100;
const two = 2;

const getRandomX = ({ width }) =>
	rndBetween(width / two, hundred - (width / two));

const getRandomY = ({ height }) =>
	rndBetween(height / two, hundred - (height / two));

const project = (position) => {
	const { x, y, width, height } = position;

	return {
		x: x - (width / two),
		y: y - (height / two),
		...position,
	};
};

export { getRandomX, getRandomY, project };
