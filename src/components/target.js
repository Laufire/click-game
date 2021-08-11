import { React } from 'react';
import context from '../core/context';
import { project } from '../services/positionService';

const Target = (target) => {
	const { actions } = context;
	const { id, x, y, height, width, image } = project(target);

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
			role="target"
			src={ image }
			style={ style }
			onClick={ () => actions.swatTarget(target) }
		/>
	);
};

export default Target;
