import context from '../../core/context';

// TODO: Rename variables appropriately.
// TODO: Use variables instead of strings.
// TODO: Test the sequence of actions.

const masterLoop = [
	'computeScore',
	'removeExpiredPowers',
	'addPowers',
	'removeDeadTargets',
	'moveTargets',
	'addTargets',
	'attackPlayer',
];

const runMasterLoop = () =>
	masterLoop.forEach((data) => context.actions[data]());

const master = {
	runMasterLoop,
	masterLoop,
};

export default master;
