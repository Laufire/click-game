import context from '../../core/context';
import clickHandlers from './handlers';

describe('Handlers', () => {
	const { actions } = context;
	const data = Symbol('data');
	const expectations = [
		[['swatTarget'], 'target', data],
		[['activatePower', 'removeActivatedPower'], 'power', data],
	];

	test.each(expectations)('when clicked triggers the action %p',
		(
			functions, param, paramValue
		) => {
			functions.forEach((fn) =>
				jest.spyOn(actions, fn).mockReturnValue());

			const testFunction = clickHandlers[param];

			testFunction(paramValue);

			functions.forEach((fn) =>
				expect(actions[fn]).toHaveBeenCalledWith(paramValue));
		});
});
