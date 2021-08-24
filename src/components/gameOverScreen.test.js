import GameOverScreen from './gameOverScreen';
import { render } from '@testing-library/react';

describe('gameOverScreen', () => {
	test('gameOverScreen display when health is 0', () => {
		const { getByRole } = render(GameOverScreen());
		const component = getByRole('game-over-screen');

		expect(component).toBeInTheDocument();
		expect(getByRole('game-over')).toBeInTheDocument();
		expect(getByRole('restart-button')).toBeInTheDocument();
		expect(getByRole('restart-button')).toHaveClass('button');
		expect(getByRole('game-over')).toHaveClass('game-over');
		expect(component).toHaveClass('game-over-screen');
	});
});
