import { Favorite } from '@material-ui/icons';
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
	<div style={ style }>
		<Favorite fontSize="large" color="secondary"/>
		{ context.state.lives } </div>;

export default Lives;
