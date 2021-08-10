import { render, fireEvent } from '@testing-library/react';

import context from '../core/context';
import TargetManager from '../services/targetManager';
import Target from './target';

describe('Target', () => {
	const { actions } = context;
	const target = TargetManager.getTarget();

	test('renders the component', () => {
		const { getByRole } = render(Target(target));

		const component = getByRole('target');

		expect(component).toBeInTheDocument();
	});

	test('when clicked triggers the action, swatTarget', () => {
		jest.spyOn(actions, 'swatTarget').mockImplementation();

		const component = render(Target(target)).getByRole('target');

		fireEvent.click(component);

		expect(actions.swatTarget).toHaveBeenCalledWith(target);
	});
});
