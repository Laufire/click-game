/* eslint-disable id-length */
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
	// rename getKilledTargets

	return {
		targets: TargetManager
			.removeTargets({ ...context, data: impactedTargets }),
		score:
			context.state.score + TargetManager
				.getTargetsScore({ ...context, data: impactedTargets }),
	};
};
// separate a action score into compute score and call in ticker.
const swatTarget = (context) =>
	TargetManager.swatTarget(context);

const removeExpiredTargets = (context) => ({
	targets: TargetManager.removeExpiredTargets(context),
});
// rename getExpiredTargets and write getExpiredPowers in service only
// and call in removeDeadTargest concat the expired and killed
// ticker call only removeDeadTargets and computeScore

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
	removeExpiredTargets,
};

export default actions;
