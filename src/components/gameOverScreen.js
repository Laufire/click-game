import { React } from 'react';
import RestartButton from './restartButton';

const width = 20;
const height = 20;
const fifty = 50;
const two = 2;

const style = {
	position: 'absolute',
	top: `${ fifty - (height / two) }%`,
	left: `${ fifty - (width / two) }%`,
	width: `${ width }%`,
	height: `${ height }%`,
	background: 'red',
	fontSize: '30pt',
	textAlign: 'center',
};

const buttonStyle = {
	cursor: 'pointer',
};

const GameOverScreen = () =>
	<div style={ style }>
		<div> GAME OVER </div>
		<div style={ buttonStyle }>{ RestartButton() }</div>
	</div>;

export default GameOverScreen;
