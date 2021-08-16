/* eslint-disable react/display-name */
jest.mock('../core/context', () => ({ state: { score: 10 }}));
jest.mock('./activePowers', () => () =>
	<div role="active-powers"><img key="a"/><img key="b"/></div>);

import { render } from '@testing-library/react';
import { React } from 'react';
import context from '../core/context';
import Score from './score';

describe('Score', () => {
	test('renders the component with appropriate styling', () => {
		const { getByRole } = render(Score());
		const component = getByRole('score');

		expect(getByRole('active-powers')).toBeInTheDocument();
		expect(component).toHaveTextContent(context.state.score);
		expect(component).toBeInTheDocument();
	});

	test('renders the star component with appropriate styling', () => {
		const { getByRole, getByTitle } = render(Score());
		const component = getByTitle('icon');

		expect(getByRole('active-powers')).toBeInTheDocument();
		expect(component).toBeInTheDocument();
	});
});
