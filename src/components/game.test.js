/* eslint-disable max-lines-per-function */
/* eslint-disable react/display-name */
jest.mock('../core/context', () => ({ state: { lives: 3 }}));
jest.mock('./gameScreen', () => () => <div role="gameScreen"/>);
jest.mock('./gameOverScreen', () => () => <div role="gameOverScreen"/>);
jest.mock('./score', () => () => <div role="score"/>);
jest.mock('./lives', () => () => <div role="lives"/>);

import React from 'react';
import { render } from '@testing-library/react';
import Game from './game';
import PowerManager from '../services/powerManager';
import context from '../core/context';

describe('Game', () => {
	test('Game renders the score,lives', () => {
		const { getByRole } = render(Game());

		expect(getByRole('score')).toBeInTheDocument();
		expect(getByRole('lives')).toBeInTheDocument();
	});

	test.skip('Game render gameOverScreen when the lives is 0', () => {
		const component = render(Game()).getByRole('gameOverScreen');

		expect(component).toBeInTheDocument();
	});

	test('Game render gameScreen when the lives is greater than 0', () => {
		const component = render(Game()).getByRole('gameScreen');

		expect(component).toBeInTheDocument();
	});

	test('className super-bat when the power super-bat is active', () => {
		const batType = 'super';

		jest.spyOn(PowerManager, 'getBatType')
			.mockImplementation(jest.fn(() => batType));

		const component = render(Game()).getByRole('game');

		expect(PowerManager.getBatType).toHaveBeenCalledWith(context.state);
		expect(component).toHaveClass('super-bat');
	});

	test('className normal-bat when the power super-bat is not active', () => {
		const batType = 'normal';

		jest.spyOn(PowerManager, 'getBatType')
			.mockImplementation(jest.fn(() => batType));

		const component = render(Game()).getByRole('game');

		expect(PowerManager.getBatType).toHaveBeenCalledWith(context.state);
		expect(component).toHaveClass('normal-bat');
	});
});
