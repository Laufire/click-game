/* eslint-disable react/display-name */
import { React } from 'react';
import { project } from '../../services/positionService';
import clickHandlers from './handlers';

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
			className="clickable"
			onClick={ () => clickHandlers[type](data) }
		/>
	);
};

export default genClickable;
