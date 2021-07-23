import { React, useEffect } from 'react';
import './App.scss';
import ticker from './services/ticker';
import Game from './components/game';

const App = () => {
	useEffect(ticker.start, []);

	return (
		<div className="App">
			{ Game() }
		</div>
	);
};

export default App;
