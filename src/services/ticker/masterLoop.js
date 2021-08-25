import context from '../../core/context';

// TODO: Rename variables appropriately.
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
