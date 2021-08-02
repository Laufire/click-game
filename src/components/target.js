/* eslint-disable max-lines-per-function */
import { React } from 'react';
import context from '../core/context';

const two = 2;

const Target = (target) => {
	const { actions } = context;
	const { id, x, y, height, width, image } = target;

	const style = {
		position: 'absolute',
		top: `${ y - (height / two) }%`,
		left: `${ x - (width / two) }%`,
		height: `${ height }vw`,
		width: `${ width }vw`,
		cursor: 'crossHair',
	};

	return (
		<img
			key={ id }
			src={ image }
			style={ style }
			onClick={ () => {
				// if(target.type === 'butterfly')
				// 	actions.decreaseLives();
				actions.swatTarget(target);
				// actions.decreaseTargetLives(target);
			} }
		/>
	);
};

export default Target;
