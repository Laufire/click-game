import PowerManager from '../services/powerManager';
import TargetManager from '../services/targetManager';

const increaseScore = ({ state, data }) => ({
	score: state.score + data.score,
});

const moveTargets = ({ state }) => ({
	targets: TargetManager.moveTargets(state.targets),
});

const addTarget = ({ state }) => ({
	targets: TargetManager.addTarget(state.targets),
});

const decreaseLives = ({ state }) => ({
	lives: state.lives - 1,
});

const removeTarget = ({ state, data }) => ({
	targets: TargetManager.removeTarget(state.targets, data),
});

const removeRandomTargets = ({ state }) => {
	const targetsToRemove = TargetManager.getRandomTargets(state.targets);

	return {
		targets: TargetManager.removeTargets(state.targets, targetsToRemove),
		score: state.score + TargetManager.getTargetsScore(targetsToRemove),
	};
};

const restart = ({ seed }) => seed;

const addPower = ({ state }) => ({
	powers: PowerManager.addPower(state.powers),
});

const removePower = ({ state }) => ({
	powers: PowerManager.removePower(state.powers),
});

const removeClickedPower = ({ state, data }) => ({
	powers: PowerManager.removeClickedPower(state.powers, data),
});

const decreaseTargetLives = ({ state, data }) => ({
	targets: TargetManager.decreaseTargetLives(state.targets, data),
});

const removeDeadTargets = ({ state }) => {
	const targetsToRemove = TargetManager.getDeadTargets(state.targets);

	return {
		targets: TargetManager.removeTargets(state.targets, targetsToRemove),
		score: state.score + TargetManager.getTargetsScore(targetsToRemove),
	};
};

const actions = {
	increaseScore,
	moveTargets,
	addTarget,
	decreaseLives,
	restart,
	removeTarget,
	removeRandomTargets,
	addPower,
	removePower,
	removeClickedPower,
	decreaseTargetLives,
	removeDeadTargets,
};

export default actions;
