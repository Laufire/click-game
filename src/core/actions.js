import { rndBetween } from '@laufire/utils/random';
import PowerManager from '../services/powerManager';
import TargetManager from '../services/targetManager';
import config from './config';

const { targetsCount, power } = config.powers.bomb;

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

const activatePower = ({ state }) => {
	const impactedTargets = TargetManager.getRandomTargets(state.targets);

	return {
		targets:
		TargetManager.decreaseTargetLives(
			state.targets, impactedTargets,
			rndBetween(power.minimum, power.maximum)
		),
	};
};

const restart = ({ seed }) => seed;

const addPower = ({ state }) => ({
	powers: PowerManager.addPower(state.powers),
});

const removePower = ({ state }) => ({
	powers: PowerManager.removePower(state.powers),
});

const removeActivatedPower = ({ state, data }) => ({
	powers: PowerManager.removeClickedPower(state.powers, data),
});

const decreaseTargetLives = ({ state, data }) => ({
	targets: TargetManager.decreaseTargetLives(
		state.targets, data, targetsCount.minimum
	),
});

const removeDeadTargets = ({ state }) => {
	const impactedTargets = TargetManager.getDeadTargets(state.targets);

	return {
		targets: TargetManager.removeTargets(state.targets, impactedTargets),
		score: state.score + TargetManager.getTargetsScore(impactedTargets),
	};
};

const actions = {
	increaseScore,
	moveTargets,
	addTarget,
	decreaseLives,
	restart,
	removeTarget,
	activatePower,
	addPower,
	removePower,
	removeActivatedPower,
	decreaseTargetLives,
	removeDeadTargets,
};

export default actions;
