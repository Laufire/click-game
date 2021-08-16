import { React } from 'react';
import context from '../core/context';
import Score from './score';
import Lives from './lives';
import GameScreen from './gameScreen';
import GameOverScreen from './gameOverScreen';
import PowerManager from '../services/powerManager';
import PlayerManager from '../services/playerManager';

const Game = () => {
	const Screen = PlayerManager.isAlive(context) ? GameScreen : GameOverScreen;
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
