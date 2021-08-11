import { Favorite } from '@material-ui/icons';
import { React } from 'react';
import context from '../core/context';
import '../App.scss';

const Lives = () =>
	<div role="lives" className="lives">
		<Favorite className="favorite"/>
		{ context.state.lives } </div>;

export default Lives;
