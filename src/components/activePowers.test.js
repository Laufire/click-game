import ActivePowers from './activePowers';
import { render } from '@testing-library/react';
import PowerManager from '../services/powerManager';
import context from '../core/context';

const { config } = context;

describe('ActivePowers', () => {
	test('renders the component with appropriate styling', () => {
		const possiblePowers = ['ice', 'superBat'];

		jest.spyOn(PowerManager, 'getActivePowers')
			.mockImplementation(() => possiblePowers);

		const activePowers = render(ActivePowers())
			.getAllByRole('active-power');

		expect(PowerManager.getActivePowers).toHaveBeenCalledWith(context);
		activePowers.map((component, i) => {
			expect(component).toBeInTheDocument();
			expect(component)
				.toHaveAttribute('src', config.powers[possiblePowers[i]].image);
		});
	});
});
