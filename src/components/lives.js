import { React } from 'react';
import context from '../core/context';

const style = {
	position: 'absolute',
	top: '0%',
	right: '0%',
	background: 'silver',
	fontSize: '5vw',
	textAlign: 'center',
};

const Lives = () =>
	<div style={ style }> { context.state.lives } </div>;

export default Lives;
