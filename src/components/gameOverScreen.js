import { React } from 'react';
import RestartButton from './restartButton';

const GameOverScreen = () =>
	<div className="game-over-screen">
		<div className="game-over"> GAME OVER </div>
		<div className="button">{ RestartButton() }</div>
	</div>;

export default GameOverScreen;
