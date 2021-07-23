import { React } from 'react';
import context from '../core/context';

const style = {
	position: 'absolute',
	top: '0%',
	left: '0%',
	background: 'silver',
	fontSize: '5vw',
	textAlign: 'center',
};

const Score = () =>
	<div style={ style }> { context.state.score } </div>;

export default Score;
