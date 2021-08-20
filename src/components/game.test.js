/* eslint-disable max-lines-per-function */
/* eslint-disable react/display-name */
jest.mock('./gameScreen', () => () => <div role="gameScreen"/>);
jest.mock('./gameOverScreen', () => () => <div role="gameOverScreen"/>);
jest.mock('./score', () => () => <div role="score"/>);
jest.mock('./healthBar', () => () => <div role="healthBar"/>);
jest.mock('../services/powerManager');
jest.mock('../services/playerManager');

import React from 'react';
import { render } from '@testing-library/react';
import PowerManager from '../services/powerManager';
import context from '../core/context';
import Game from './game';
import PlayerManager from '../services/playerManager';

describe('Game', () => {
	test('Game renders the score, lives', () => {
		const { getByRole } = render(Game());

		expect(getByRole('score')).toBeInTheDocument();
		expect(getByRole('healthBar')).toBeInTheDocument();
	});

	test('Game render gameOverScreen when the lives is 0', () => {
		jest.spyOn(PlayerManager, 'isAlive').mockReturnValue(false);

		const component = render(Game()).getByRole('gameOverScreen');

		expect(PlayerManager.isAlive).toHaveBeenCalledWith(context);
		expect(component).toBeInTheDocument();
	});

	test('Game render gameScreen when the lives is greater than 0', () => {
		jest.spyOn(PlayerManager, 'isAlive').mockReturnValue(true);

		const component = render(Game()).getByRole('gameScreen');

		expect(PlayerManager.isAlive).toHaveBeenCalledWith(context);
		expect(component).toBeInTheDocument();
	});

	test('className super-bat when the power super-bat is active', () => {
		const batType = 'super';

		jest.spyOn(PowerManager, 'getBatType').mockReturnValue(batType);

		const component = render(Game()).getByRole('game');

		expect(PowerManager.getBatType).toHaveBeenCalledWith(context.state);
		expect(component).toHaveClass('super-bat');
	});

	test('className normal-bat when the power super-bat is not active', () => {
		const batType = 'normal';

		jest.spyOn(PowerManager, 'getBatType').mockReturnValue(batType);

		const component = render(Game()).getByRole('game');

		expect(PowerManager.getBatType).toHaveBeenCalledWith(context.state);
		expect(component).toHaveClass('normal-bat');
	});
});
