/* eslint-disable react/display-name */
// TODO: write the test,  desc: component renders the appropriate icon
jest.mock('@material-ui/icons/Favorite', () => () => <div role="favorite"/>);
jest.mock('../core/context', () => ({ state: { lives: 2 }}));

import React from 'react';
import { render } from '@testing-library/react';
import Lives from './lives';

describe('Lives', () => {
	test('renders the component with appropriate styling', () => {
		const { getByRole } = render(Lives());

		const component = getByRole('lives');

		expect(getByRole('favorite')).toBeInTheDocument();
		expect(component).toBeInTheDocument();
		expect(component).toHaveClass('lives');
	});
});
