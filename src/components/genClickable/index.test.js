/* eslint-disable max-lines-per-function */
import { fireEvent, render } from '@testing-library/react';
import * as PositionService from '../../services/positionService';
import TargetManager from '../../services/targetManager';
import genClickable from '.';
import { rndValue } from '@laufire/utils/random';
import PowerManager from '../../services/powerManager';
import { keys } from '@laufire/utils/lib';
import context from '../../core/context';
import clickHandlers from './handlers';

describe('', () => {
	const { config } = context;
	const target = TargetManager.getTarget();
	const type = rndValue(keys(config.powers));
	const power = PowerManager.getPower({ type });
	const expectations = [
		['target', target],
		['power', power],
	];

	test.each(expectations)('renders the component %p with appropriate styling',
		(param, paramValue) => {
			const projectedTarget = {
				...paramValue,
				x: 10,
				y: 15,
				width: 20,
				height: 25,
			};
			const { x, y, width, height, image } = projectedTarget;

			jest.spyOn(PositionService, 'project')
				.mockReturnValue(projectedTarget);

			const Result = genClickable(param);
			const { getByRole } = render(Result(paramValue));

			const component = getByRole(param);

			expect(PositionService.project).toHaveBeenCalledWith(paramValue);
			expect(component).toBeInTheDocument();
			expect(component)
				.toHaveAttribute('src', image);
			expect(component).toHaveStyle({
				position: 'absolute',
				top: `${ y }%`,
				left: `${ x }%`,
				height: `${ height }vw`,
				width: `${ width }vw`,
			});
		});

	test.each(expectations)('when clicked triggers the handler %p',
		(param, paramValue) => {
			jest.spyOn(clickHandlers, param).mockReturnValue();

			const Result = genClickable(param);
			const component = render(Result(paramValue)).getByRole(param);

			fireEvent.click(component);

			expect(clickHandlers[param]).toHaveBeenCalledWith(paramValue);
		});
});
