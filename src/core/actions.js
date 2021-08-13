import PlayerManager from '../services/playerManager';
import PowerManager from '../services/powerManager';
import TargetManager from '../services/targetManager';

const increaseScore = (context) => ({
	score: PlayerManager.adjustScore(context),
});

const moveTargets = (context) => ({
	targets: TargetManager.moveTargets(context),
});

const addTargets = (context) => ({
	targets: TargetManager.addTargets(context),
});

const decreaseLives = (context) => ({
	lives: PlayerManager.decreaseLives(context),
});

const removeTarget = (context) => ({
	targets: TargetManager.removeTargets({ ...context, data: [context.data] }),
});

const activatePower = (context) =>
	PowerManager.activatePower(context);

const restart = ({ seed }) => seed;

const addPowers = (context) => ({
	powers: PowerManager.addPowers(context),
});

const removeExpiredPowers = (context) => ({
	powers: PowerManager.removeExpiredPowers(context),
});

const removeActivatedPower = (context) => ({
	powers: PowerManager.removePower(context),
});

const removeDeadTargets = (context) => {
	const impactedTargets = TargetManager.getDeadTargets(context);

	return {
		targets: TargetManager
			.removeTargets({ ...context, data: impactedTargets }),
		score:
			context.state.score + TargetManager
				.getTargetsScore({ ...context, data: impactedTargets }),
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
