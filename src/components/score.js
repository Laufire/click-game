import { Stars } from '@material-ui/icons';
import { React } from 'react';
import context from '../core/context';

const style = {
	position: 'absolute',
	top: '0%',
	left: '0%',
	background: 'silver',
	fontSize: '4vw',
	textAlign: 'center',
};

const getStyle = {
	color: 'gold',
	fontSize: '3vw',
};

const Score = () =>
	<div style={ style }>
		<Stars style={ getStyle }/>
		{ context.state.score } </div>;

export default Score;
