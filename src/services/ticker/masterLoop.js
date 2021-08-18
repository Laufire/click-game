import context from '../../core/context';

const masterLoop = [
	'moveTargets',
	'addTargets',
	'removeExpiredPowers',
	'addPowers',
	'removeDeadTargets',
	'removeExpiredTargets',
];

const runMasterLoop = () =>
	masterLoop.forEach((data) => context.actions[data]());

const master = {
	runMasterLoop,
	masterLoop,
};

export default master;
