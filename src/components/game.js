import { React } from 'react';
import context from '../core/context';
import Score from './score';
import Lives from './lives';
import GameScreen from './gameScreen';
import GameOverScreen from './gameOverScreen';

const Game = () => {
	const Screen = context.state.lives === 0 ? GameOverScreen : GameScreen;

	return (
		<div className="demoImage">
			{ Screen() }
			{ Score() }
			{ Lives() }
		</div>
	);
};

export default Game;
