/* eslint-disable max-lines-per-function */
/* eslint-disable react/display-name */
jest.mock('./gameScreen', () => () => <div role="gameScreen"/>);
jest.mock('./gameOverScreen', () => () => <div role="gameOverScreen"/>);
jest.mock('./score', () => () => <div role="score"/>);
jest.mock('./lives', () => () => <div role="lives"/>);
jest.mock('../services/powerManager');
jest.mock('../services/helperService');

import React from 'react';
import { render } from '@testing-library/react';
import PowerManager from '../services/powerManager';
import context from '../core/context';
import * as HelperService from '../services/helperService';
import Game from './game';

describe('Game', () => {
	test('Game renders the score,lives', () => {
		const { getByRole } = render(Game());

		expect(getByRole('score')).toBeInTheDocument();
		expect(getByRole('lives')).toBeInTheDocument();
	});

	test('Game render gameOverScreen when the lives is 0', () => {
		jest.spyOn(HelperService, 'isAlive').mockReturnValue(false);

		const component = render(Game()).getByRole('gameOverScreen');

		expect(HelperService.isAlive).toHaveBeenCalledWith(context);
		expect(component).toBeInTheDocument();
	});

	test('Game render gameScreen when the lives is greater than 0', () => {
		jest.spyOn(HelperService, 'isAlive').mockReturnValue(true);

		const component = render(Game()).getByRole('gameScreen');

		expect(HelperService.isAlive).toHaveBeenCalledWith(context);
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
