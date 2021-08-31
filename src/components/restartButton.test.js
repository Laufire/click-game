import { render, fireEvent } from '@testing-library/react';

import context from '../core/context';
import Restart from './restartButton';

describe('Restart', () => {
	const { actions } = context;

	test('Component render with appropriate styling.', () => {
		const component = render(Restart()).getByRole('restart');

		expect(component).toBeInTheDocument();
		expect(component).toHaveClass('restart');
	});

	test('when clicked triggers the action, restart', () => {
		jest.spyOn(actions, 'restart').mockReturnValue();
		const component = render(Restart()).getByRole('restart');

		fireEvent.click(component);

		expect(actions.restart).toHaveBeenCalled();
	});
});
