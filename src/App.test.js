import { React } from 'react';
import { render } from '@testing-library/react';

jest.mock('./services/ticker');
jest.mock('./components/game');

import App from './App';

test('renders learn react link', () => {
	render(<App/>);
});
