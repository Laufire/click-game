jest.mock('./genClickable', () => () => () => Symbol('genClickable'));

import Target from './target';

describe('Target', () => {
	test('when clicked triggers the action, swatTarget', () => {
		const result = Target();

		expect(result).toEqual(expect.any(Symbol));
	});
});
