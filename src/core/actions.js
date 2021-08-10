import PowerManager from '../services/powerManager';
import TargetManager from '../services/targetManager';

const increaseScore = (context) => ({
	score: context.state.score + context.data.score,
});

const moveTargets = ({ state }) => ({
	targets: TargetManager.moveTargets(state),
});

const addTargets = ({ state }) => ({
	targets: TargetManager.addTargets(state),
});

const decreaseLives = ({ state }) => ({
	lives: state.lives - 1,
});

const removeTarget = (context) => ({
	targets: TargetManager.removeTarget(context),
});

const activatePower = (context) =>
	PowerManager.activatePower(context);

const restart = ({ seed }) => seed;

const addPowers = ({ state }) => ({
	powers: PowerManager.addPowers(state),
});

const removeExpiredPowers = ({ state }) => ({
	powers: PowerManager.removeExpiredPowers(state),
});

const removeActivatedPower = (context) => ({
	powers: PowerManager.removePower(context),
});

const removeDeadTargets = ({ state }) => {
	const impactedTargets = TargetManager.getDeadTargets(state);

	return {
		targets: TargetManager.removeTargets(state.targets, impactedTargets),
		score: state.score + TargetManager.getTargetsScore(impactedTargets),
	};
};

const swatTarget = (context) =>
	TargetManager.swatTarget(context);

const actions = {
	increaseScore,
	moveTargets,
	addTargets,
	decreaseLives,
	restart,
	removeTarget,
	activatePower,
	addPowers,
	removeExpiredPowers,
	removeActivatedPower,
	removeDeadTargets,
	swatTarget,
};

export default actions;
