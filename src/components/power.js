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
	};
};

const Power = (data) => {
	const { id, image } = data;

	return (
		<img
			key={ id }
			role="power"
			src={ image }
			style={ getStyle(data) }
			onClick={ () => {
				context.actions.activatePower(data);
				context.actions.removeActivatedPower(data);
			} }
		/>
	);
};

export default Power;
