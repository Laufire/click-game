import context from '../../core/context';

// TODO: Rename variables appropriately.
// TODO: Use variables instead of strings.
const masterLoop = [
	'computeScore',
	'moveTargets',
	'removeDeadTargets',
	'addTargets',
	'attackPlayer',
	'removeExpiredPowers',
	'addPowers',
];

const runMasterLoop = () =>
	masterLoop.forEach((data) => context.actions[data]());

const master = {
	runMasterLoop,
	masterLoop,
};

export default master;
