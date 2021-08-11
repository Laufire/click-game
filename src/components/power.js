import { React } from 'react';
import context from '../core/context';
import { project } from '../services/positionService';

const getStyle = (power) => {
	const { x, y, height, width } = project(power);

	return {
		position: 'absolute',
		top: `${ y }%`,
		left: `${ x }%`,
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
