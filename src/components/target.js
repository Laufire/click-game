
/* eslint-disable max-lines-per-function */
import { React } from 'react';
import context from '../core/context';
import { rndBetween } from '@laufire/utils/random';

const two = 2;

const Target = (target) => {
	const { actions } = context;
	const { id, x, y, height, width, image, variance } = target;
	const randomVariance = rndBetween(1, variance);

	const style = {
		position: 'absolute',
		top: `${ y - (height / two) }%`,
		left: `${ x - (width / two) }%`,
		height: `${ height * randomVariance }vw`,
		width: `${ width * randomVariance }vw`,
		cursor: 'crossHair',
	};

	return (
		<img
			key={ id }
			src={ image }
			style={ style }
			onClick={ () => {
				if(target.type === 'butterfly')
					actions.decreaseLives();
				actions.decreaseTargetLives(target);
			} }
		/>
	);
};

export default Target;
