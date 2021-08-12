import ActivePowers from './activePowers';
import { render } from '@testing-library/react';
import PowerManager from '../services/powerManager';
import context from '../core/context';

describe('ActivePowers', () => {
	test('renders the component with appropriate styling', () => {
		jest.spyOn(PowerManager, 'getActivePowers')
			.mockImplementation(jest.fn(() => ['ice', 'superBat']));

		const activePowers = render(ActivePowers())
			.getAllByRole('active-power');

		expect(PowerManager.getActivePowers).toHaveBeenCalledWith(context);
		activePowers.map((component) => expect(component).toBeInTheDocument());
	});
});
