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
	test('Game renders the score, health', () => {
		const { getByRole } = render(Game());

		expect(getByRole('score')).toBeInTheDocument();
		expect(getByRole('healthBar')).toBeInTheDocument();
	});

	const expects = [
		['gameScreen', true],
		['gameOverScreen', false],
	];

	test.each(expects)('Game render %p when the isAlive is %p',
		(screen, isActive) => {
			jest.spyOn(PlayerManager, 'isAlive').mockReturnValue(isActive);

			const component = render(Game()).getByRole(screen);

			expect(PlayerManager.isAlive).toHaveBeenCalledWith(context);
			expect(component).toBeInTheDocument();
		});

	const expectations = [
		['active', 'super'],
		['inactive', 'normal'],
	];

	test.each(expectations)('when the power is %p className is %p-bat ',
		(dummy, type) => {
			jest.spyOn(PowerManager, 'getBatType').mockReturnValue(type);

			const component = render(Game()).getByRole('game');

			expect(PowerManager.getBatType).toHaveBeenCalledWith(context.state);
			expect(component).toHaveClass(`${ type }-bat`);
		});
});
