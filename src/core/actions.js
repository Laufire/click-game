// import Target from '../components/target';
import PowerManager from '../services/powerManager';
import TargetManager from '../services/targetManager';
import config from './config';

const { swatDamage } = config;

const increaseScore = ({ state, data }) => ({
	score: state.score + data.score,
});

const moveTargets = ({ state }) => ({
	targets: TargetManager.moveTargets(state),
});

const addTargets = ({ state }) => ({
	targets: TargetManager.addTargets(state.targets),
});

const decreaseLives = ({ state }) => ({
	lives: state.lives - 1,
});

const removeTarget = ({ state, data }) => ({
	targets: TargetManager.removeTarget(state.targets, data),
});

const activatePower = ({ state, data }) =>
	PowerManager.activatePower(state, data);

const restart = ({ seed }) => seed;

const addPowers = ({ state }) => ({
	powers: PowerManager.addPowers(state.powers),
});

const removePowers = ({ state }) => ({
	powers: PowerManager.removePowers(state.powers),
});

const removeActivatedPower = ({ state, data }) => ({
	powers: PowerManager.removeActivatedPower(state.powers, data),
});

const decreaseTargetLives = ({ state, data }) => ({
	targets: TargetManager.decreaseTargetLives(
		state.targets, [data], swatDamage
	),
});

const removeDeadTargets = ({ state }) => {
	const impactedTargets = TargetManager.getDeadTargets(state.targets);

	return {
		targets: TargetManager.removeTargets(state.targets, impactedTargets),
		score: state.score + TargetManager.getTargetsScore(impactedTargets),
	};
};

const swatTarget = ({ state, data }) =>
	TargetManager.swatTarget(state, data);

const actions = {
	increaseScore,
	moveTargets,
	addTargets,
	decreaseLives,
	restart,
	removeTarget,
	activatePower,
	addPowers,
	removePowers,
	removeActivatedPower,
	decreaseTargetLives,
	removeDeadTargets,
	swatTarget,
};

export default actions;
