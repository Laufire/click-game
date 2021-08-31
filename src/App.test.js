/* eslint-disable react/display-name */
jest.mock('./components/game', () => () => <div role="game"/>);

import React from 'react';
import { render } from '@testing-library/react';

import ticker from './services/ticker';
import App from './App';

test('App renders the game', () => {
	jest.spyOn(React, 'useEffect');
	jest.spyOn(ticker, 'start').mockReturnValue();

	const { getByRole } = render(<App/>);

	expect(React.useEffect).toHaveBeenCalledWith(ticker.start, []);

	expect(getByRole('game')).toBeInTheDocument();
});
