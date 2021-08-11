// TODO: write the test,  desc: component renders the appropriate icon
jest.mock('../core/context', () => ({ state: { lives: 2 }}));
import { render } from '@testing-library/react';
import Lives from './lives';

describe('Lives', () => {
	test('renders the component with appropriate styling', () => {
		const { getByRole } = render(Lives());

		const component = getByRole('lives');

		expect(component).toBeInTheDocument();
	});
});
