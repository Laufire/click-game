import { React } from 'react';
import context from '../core/context';
import Score from './score';
import GameScreen from './gameScreen';
import GameOverScreen from './gameOverScreen';
import PowerManager from '../services/powerManager';
import PlayerManager from '../services/playerManager';
import healthBar from './healthBar';

const Game = () => {
	const Screen = PlayerManager.isAlive(context) ? GameScreen : GameOverScreen;
	const className = `${ PowerManager.getBatType(context.state) }-bat`;

	return (
		<div className={ className } role="game">
			{ Screen() }
			{ Score() }
			{ healthBar() }
		</div>
	);
};

export default Game;
