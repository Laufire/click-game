/* eslint-disable max-lines-per-function */
import { keys } from '@laufire/utils/lib';
import { rndValue } from '@laufire/utils/random';
import { fireEvent, render } from '@testing-library/react';
import config from '../core/config';
import context from '../core/context';
import * as PositionService from '../services/positionService';
import PowerManager from '../services/powerManager';
import Power from './power';

describe('Power', () => {
	const { actions } = context;
	const type = rndValue(keys(config.powers));
	const power = PowerManager.getPower({ type });

	test('renders the component with appropriate styling', () => {
		const projectedPower = {
			x: 10,
			y: 15,
			width: 20,
			height: 25,
		};
		const { x, y, width, height } = projectedPower;

		jest.spyOn(PositionService, 'project')
			.mockImplementation(jest.fn(() => projectedPower));

		const { getByRole } = render(Power(power));
		const component = getByRole('power');

		expect(PositionService.project).toHaveBeenCalledWith(power);
		expect(component).toBeInTheDocument();
		expect(component).toHaveStyle({
			position: 'absolute',
			top: `${ y }%`,
			left: `${ x }%`,
			height: `${ height }vw`,
			width: `${ width }vw`,
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
