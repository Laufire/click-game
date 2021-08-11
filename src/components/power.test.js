/* eslint-disable max-lines-per-function */
import { keys } from '@laufire/utils/lib';
import { rndValue } from '@laufire/utils/random';
import { fireEvent, render } from '@testing-library/react';
import config from '../core/config';
import context from '../core/context';

import PowerManager from '../services/powerManager';
import Power from './power';

describe('Power', () => {
	const { actions } = context;
	const type = rndValue(keys(config.powers));
	const power = PowerManager.getPower({ type });

	test('renders the component with appropriate styling', () => {
		const { getByRole } = render(Power(power));

		const component = getByRole('power');

		expect(component).toBeInTheDocument();
		expect(component).toHaveStyle({
			position: 'absolute',
			height: `${ power.height }vw`,
			width: `${ power.width }vw`,
		});
	});

	test('when clicked triggers the action, activePower & removeActivatedPower'
		, () => {
			jest.spyOn(actions, 'activatePower').mockImplementation();
			jest.spyOn(actions, 'removeActivatedPower').mockImplementation();

			const component = render(Power(power)).getByRole('power');

			fireEvent.click(component);

			expect(actions.activatePower).toHaveBeenCalledWith(power);
			expect(actions.removeActivatedPower).toHaveBeenCalledWith(power);
		});
});
