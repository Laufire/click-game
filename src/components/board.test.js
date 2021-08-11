import { render, fireEvent } from '@testing-library/react';

import context from '../core/context';
import Board from './board';

describe('Board', () => {
	const { actions } = context;

	test('when clicked triggers the action, decreaseLives', () => {
		jest.spyOn(actions, 'decreaseLives').mockImplementation();

		const component = render(Board()).getByRole('board');

		fireEvent.click(component);

		expect(component).toBeInTheDocument();
		expect(actions.decreaseLives).toHaveBeenCalled();
		expect(component).toHaveStyle({
			position: 'absolute',
			height: '100%',
			width: '100%',
		});
	});
});
