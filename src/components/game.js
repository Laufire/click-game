import { React } from 'react';
import context from '../core/context';
import Score from './score';
import Lives from './lives';
import GameScreen from './gameScreen';
import GameOverScreen from './gameOverScreen';
import moment from 'moment';

const Game = () => {
	const Screen = context.state.lives === 0 ? GameOverScreen : GameScreen;
	const cursor = moment() < context.state.superTill
		? 'super-bat'
		: 'normal-bat';

	return (
		<div className={ cursor }>
			{ Screen() }
			{ Score() }
			{ Lives() }
		</div>
	);
};

export default Game;
