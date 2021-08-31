/* eslint-disable max-lines-per-function */
import { render, fireEvent } from '@testing-library/react';

import context from '../core/context';
import TargetManager from '../services/targetManager';
import * as PositionService from '../services/positionService';
import Target from './target';

describe('Target', () => {
	const { actions } = context;
	const target = TargetManager.getTarget();

	test('renders the component with appropriate styling', () => {
		const projectedTarget = {
			x: 10,
			y: 15,
			width: 20,
			height: 25,
		};
		const { x, y, width, height } = projectedTarget;

		jest.spyOn(PositionService, 'project')
			.mockReturnValue(projectedTarget);
		const { getByRole } = render(Target(target));

		const component = getByRole('target');

		expect(component).toBeInTheDocument();
		expect(component).toHaveStyle({
			position: 'absolute',
			top: `${ y }%`,
			left: `${ x }%`,
			height: `${ height }vw`,
			width: `${ width }vw`,
		});
	});

	test('when clicked triggers the action, swatTarget', () => {
		jest.spyOn(actions, 'swatTarget').mockReturnValue();

		const component = render(Target(target)).getByRole('target');

		fireEvent.click(component);

		expect(actions.swatTarget).toHaveBeenCalledWith(target);
	});
});
