import { React } from 'react';
import context from '../core/context';
import Board from './board';
import Container from './container';
import Power from './power';
import Target from './target';

const GameScreen = () =>
	<>
		{ Board() }
		{ Container(context.state.targets, Target) }
		{ Container(context.state.powers, Power) }
	</>;

export default GameScreen;
