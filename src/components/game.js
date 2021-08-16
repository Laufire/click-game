import { React } from 'react';
import context from '../core/context';
import Score from './score';
import Lives from './lives';
import GameScreen from './gameScreen';
import GameOverScreen from './gameOverScreen';
import PowerManager from '../services/powerManager';

const Game = () => {
	const Screen = context.state.lives === 0 ? GameOverScreen : GameScreen;
	const className = `${ PowerManager.getBatType(context.state) }-bat`;

	return (
		<div className={ className } role="game">
			{ Screen() }
			{ Score() }
			{ Lives() }
		</div>
	);
};

export default Game;
