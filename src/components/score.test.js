/* eslint-disable max-statements */

jest.mock('../core/context', () => ({ state: { score: 10 }}));

import { render } from '@testing-library/react';
import { React } from 'react';
import context from '../core/context';
import PowerManager from '../services/powerManager';
import ActivePower from './activePower';
import * as Container from './container';
import Score from './score';

describe('Score', () => {
	test('renders the component with appropriate styling', () => {
		const getActivePowers = Symbol('getActivePowers');

		const containerSpy = jest.spyOn(Container, 'default')
			.mockReturnValue(<div role="active-power"/>);

		jest.spyOn(PowerManager, 'getActivePowers')
			.mockReturnValue(getActivePowers);

		const { getByRole, getByTitle } = render(Score());
		const component = getByRole('score');

		expect(component).toBeInTheDocument();
		expect(component).toHaveClass('score');
		expect(getByTitle('icon')).toBeInTheDocument();
		expect(getByTitle('icon')).toHaveClass('score-icon');
		expect(component).toHaveTextContent(context.state.score);
		expect(PowerManager.getActivePowers).toHaveBeenCalledWith(context);
		expect(getByRole('active-power')).toBeInTheDocument();
		expect(containerSpy)
			.toHaveBeenCalledWith(getActivePowers, ActivePower);
	});
});
