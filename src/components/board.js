import { React } from 'react';
import context from '../core/context';

const boardStyle = {
	position: 'absolute',
	height: '100%',
	width: '100%',
};

const Board = () =>
	<div
		role="board"
		style={ boardStyle }
		onClick={ context.actions.decreaseLives }
	/>;

export default Board;
