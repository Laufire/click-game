import { render, fireEvent } from '@testing-library/react';

import context from '../core/context';
import Restart from './restartButton';

describe('Restart', () => {
	const { actions } = context;

	test('when clicked triggers the action, restart', () => {
		jest.spyOn(actions, 'restart').mockImplementation();

		const component = render(Restart()).getByRole('restart');

		fireEvent.click(component);

		expect(component).toBeInTheDocument();
		expect(component).toHaveStyle({
			marginTop: '0.5em',
			background: 'silver',
			fontSize: '30pt',
			textAlign: 'center',
		});
		expect(actions.restart).toHaveBeenCalled();
	});
});
