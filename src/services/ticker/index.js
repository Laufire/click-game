import context from '../../core/context';
import MasterLoop from './masterLoop';

// TODO: Change to new service format.
const start = () => {
	const { config } = context;
	const { tickerDelay } = config;

	MasterLoop.runMasterLoop();

	setInterval(MasterLoop.runMasterLoop, tickerDelay);
};

const Ticker = {
	start,
};

export default Ticker;
