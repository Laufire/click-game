import ActivePower from './activePower';
import { render } from '@testing-library/react';
import context from '../core/context';
import { keys } from '@laufire/utils/collection';
import { rndValue } from '@laufire/utils/random';

const { config } = context;

describe('ActivePower', () => {
	const powerType = rndValue(keys(config.powers));

	test('renders the component with appropriate styling', () => {
		const component = render(ActivePower(powerType))
			.getByRole('active-power');

		expect(component).toBeInTheDocument();
		expect(component)
			.toHaveAttribute('src', config.powers[powerType].image);
		expect(component).toHaveClass('active-power');
	});
});
