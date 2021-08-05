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

		setInterval(() => {
			masterLoop.forEach((data) => context.actions[data]());
		}, tickerDelay);
	};

	return {
		start,
	};
};

const ticker = Ticker();

export default ticker;
