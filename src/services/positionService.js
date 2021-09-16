import { rndBetween } from '@laufire/utils/random';

const hundred = 100;
const two = 2;

const getRandomX = ({ width }) =>
	rndBetween(width / two, hundred - (width / two));

const getRandomY = ({ height }) =>
	rndBetween(height / two, hundred - (height / two));

const getPosition = ({ width, height, speed, x, y }) => {
	const xMargin = width / two;
	const yMargin = height / two;

	return {
		x: rndBetween(Math.max(Math.ceil(xMargin), x - speed),
			Math.min(Math.floor(hundred - xMargin), x + speed)),

		y: rndBetween(Math.max(Math.ceil(yMargin), y - speed),
			Math.min(Math.floor(hundred - yMargin), y + speed)),
	};
};

const project = (position) => {
	const { x, y, width, height } = position;

	return {
		...position,
		x: x - (width / two),
		y: y - (height / two),
	};
};

export { getRandomX, getRandomY, project, getPosition };
