import { React } from 'react';
import context from '../core/context';

const two = 2;

const getStyle = (power) => {
	const { x, y, height, width } = power;

	return {
		position: 'absolute',
		top: `${ y - (height / two) }%`,
		left: `${ x - (width / two) }%`,
		height: `${ height }vw`,
		width: `${ width }vw`,
		cursor: 'crossHair',
	};
};

const Power = (power) => {
	const { id, image } = power;

	return (
		<img
			key={ id }
			src={ image }
			style={ getStyle(power) }
			onClick={ () => {
				context.actions.activatePower();
				context.actions.removeActivatedPower(power);
			} }
		/>
	);
};

export default Power;
