import { React } from 'react';
import context from '../core/context';
import '../App.scss';

const Board = () =>
	<div
		role="board"
		className="board"
		onClick={ context.actions.decreaseLives }
	/>;

export default Board;
