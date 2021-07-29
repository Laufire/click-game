import { React } from 'react';
import Board from './board';
import Target from './target';
import context from '../core/context';
import Power from './power';
import { peek } from '@laufire/utils/debug';

const GameScreen = () =>
	<>
		{ Board(context) }
		{ context.state.targets.map(Target) }
		{ peek(context.state.powers).map(Power) }
	</>;

export default GameScreen;
