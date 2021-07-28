import { React, useEffect } from 'react';
import './App.scss';
import ticker from './services/ticker';
import Game from './components/game';
import context from './core/context';

const App = () => {
	useEffect(ticker.start, []);

	// eslint-disable-next-line no-console
	console.log(context.state);

	return (
		<div className="App">
			{ Game() }
		</div>
	);
};

export default App;
