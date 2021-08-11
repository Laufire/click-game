import { Favorite } from '@material-ui/icons';
import { React } from 'react';
import context from '../core/context';

const style = {
	position: 'absolute',
	top: '0%',
	right: '0%',
	background: 'silver',
	fontSize: '4vw',
	textAlign: 'center',
};

const getStyle = {
	color: 'red',
	fontSize: '3vw',
};

const Lives = () =>
	<div style={ style } role="lives">
		<Favorite style={ getStyle }/>
		{ context.state.lives } </div>;

export default Lives;
