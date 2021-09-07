/* eslint-disable react/display-name */
import { React } from 'react';
import context from '../core/context';
import { project } from '../services/positionService';

const clickHandlers = {
	target: (data) => context.actions.swatTarget(data),
	power: (data) => {
		context.actions.activatePower(data);
		context.actions.removeActivatedPower(data);
	},
};

const genClickable = (type) => (data) => {
	const { id, x, y, height, width, image } = project(data);

	const style = {
		position: 'absolute',
		top: `${ y }%`,
		left: `${ x }%`,
		height: `${ height }vw`,
		width: `${ width }vw`,
	};

	return (
		<img
			key={ id }
			role={ type }
			src={ image }
			style={ style }
			onClick={ () => clickHandlers[type](data) }
		/>
	);
};

export default genClickable;
