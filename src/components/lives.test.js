/* eslint-disable react/display-name */
jest.mock('../core/context', () => ({ state: { lives: 2 }}));

import { render } from '@testing-library/react';
import context from '../core/context';
import Lives from './lives';

describe('Lives', () => {
	test('renders the component with appropriate styling', () => {
		const { getByTitle, getByRole } = render(Lives());

		const component = getByRole('lives');

		expect(getByTitle('favorite')).toBeInTheDocument();
		expect(getByTitle('favorite')).toHaveClass('favorite');
		expect(component).toHaveTextContent(context.state.lives);
		expect(component).toBeInTheDocument();
		expect(component).toHaveClass('lives');
	});
});
