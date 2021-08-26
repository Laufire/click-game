import context from '../../core/context';
import MasterLoop from './masterLoop';

// TODO: Simplify the implementation.
const Ticker = () => {
	const start = () => {
		const { config } = context;
		const { tickerDelay } = config;

		MasterLoop.runMasterLoop();

		setInterval(MasterLoop.runMasterLoop, tickerDelay);
	};

	return {
		start,
	};
};

const ticker = Ticker();

export default ticker;
