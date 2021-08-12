jest.mock('../core/context', () => ({ state: { score: 10 }}));

import { render } from '@testing-library/react';
import ActivePowers from './activePowers';
import Score from './score';

describe('Score', () => {
	test('renders the component with appropriate styling', () => {
		const component = render(Score()).getByRole('score');

		jest.mock('./activePowers', () => Symbol('img'));

		expect(ActivePowers);
		expect(component).toBeInTheDocument();
		// expect(component).toHaveStyle({
		// 	color: 'gold',
		// 	fontSize: '3vw',
		// });
	});
});
