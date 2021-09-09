jest.mock('../core/context', () => ({ state: {
	targets: Symbol('targets'),
	powers: Symbol('powers'),
}}));

import React from 'react';
import { render } from '@testing-library/react';
import GameScreen from './gameScreen';
import * as Board from './board';
import * as Container from './container';
import context from '../core/context';
import Target from './target';
import Power from './power';

describe('gameScreen', () => {
	test('gameScreen renders the board,targets,powers', () => {
		const containerSpy = jest.spyOn(Container, 'default')
			.mockReturnValueOnce(<div role="targets"/>)
			.mockReturnValueOnce(<div role="powers"/>);

		jest.spyOn(Board, 'default')
			.mockReturnValueOnce(<div role="board"/>);

		const { getByRole } = render(GameScreen());

		expect(getByRole('board')).toBeInTheDocument();
		expect(getByRole('targets')).toBeInTheDocument();
		expect(getByRole('powers')).toBeInTheDocument();

		expect(containerSpy)
			.toHaveBeenCalledWith(context.state.targets, Target);
		expect(containerSpy)
			.toHaveBeenCalledWith(context.state.powers, Power);
	});
});
