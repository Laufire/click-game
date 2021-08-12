import { React } from 'react';
import RestartButton from './restartButton';
import '../App.scss';

const GameOverScreen = () =>
	<div className="game-over-screen" role="game-over-screen">
		<div className="game-over" role="game-over"> GAME OVER </div>
		<div className="button" role="restart-button">{ RestartButton() }</div>
	</div>;

export default GameOverScreen;
