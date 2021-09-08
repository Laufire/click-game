/* eslint-disable max-lines-per-function */
jest.mock('./genClickable/index', () => () => () => Symbol('genClickable'));
import Power from './power';

describe('Power', () => {
	test('renders the component with appropriate styling', () => {
		const result = Power();

		expect(result).toEqual(expect.any(Symbol));
	});
});
