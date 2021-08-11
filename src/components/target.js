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
	};

	return (
		<img
			key={ id }
			role="target"
			src={ image }
			style={ style }
			onClick={ () => actions.swatTarget(target) }
		/>
	);
};

export default Target;
