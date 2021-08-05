import context from '../core/context';

const masterLoop = [
	'moveTargets',
	'addTargets',
	'removeExpiredPowers',
	'addPowers',
	'removeDeadTargets',
];

const Ticker = () => {
	const start = () => {
		const { config } = context;
		const { tickerDelay } = config;

		const runMasterLoop = () =>
			masterLoop.forEach((data) => context.actions[data]());

		runMasterLoop();

		setInterval(runMasterLoop, tickerDelay);
	};

	return {
		start,
	};
};

const ticker = Ticker();

export default ticker;
