/* eslint-disable react/display-name */
jest.mock('../core/context', () => ({ state: { health: 2 }}));

import { render } from '@testing-library/react';
import context from '../core/context';
import PlayerManager from '../services/playerManager';
import healthBar from './healthBar';

describe('HealthBar', () => {
	const healthRatio = 0.72;

	test('renders the component with appropriate styling', () => {
		jest.spyOn(PlayerManager, 'getHealthRatio')
			.mockImplementation(() => healthRatio);
		jest.spyOn(PlayerManager, 'getHealthColor')
			.mockImplementation(() => 'yellow');

		const { getByRole } = render(healthBar());
		const component = getByRole('healthBar');

		expect(PlayerManager.getHealthRatio)
			.toHaveBeenCalledWith(context);
		expect(PlayerManager.getHealthColor)
			.toHaveBeenCalledWith(healthRatio);
		expect(component).toHaveTextContent(context.state.health);
		expect(component).toBeInTheDocument();
	});
});
