import PlayerManager from '../services/playerManager';
import PowerManager from '../services/powerManager';
import TargetManager from '../services/targetManager';

const moveTargets = (context) => ({
	targets: TargetManager.moveTargets(context),
});

const addTargets = (context) => ({
	targets: TargetManager.addTargets(context),
});

const swatBoard = (context) => ({
	health: PlayerManager.penalize(context),
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
	const deadTargets = [
		...TargetManager.getKilledTargets(context),
		...TargetManager.getExpiredTargets(context),
	];

	return {
		targets: TargetManager
			.removeTargets({ ...context, data: deadTargets }),
	};
};

const computeScore = (context) => {
	const { score, multipliers } = TargetManager.getTargetsScore({
		...context,
		data: TargetManager.getKilledTargets(context),
	});

	return {
		score: PlayerManager.adjustScore(context.state, score),
		multipliers: multipliers,
	};
};

const swatTarget = (context) =>
	TargetManager.swatTarget(context);

const attackPlayer = (context) => ({
	health: PlayerManager.getAttacked(context),
});

const actions = {
	moveTargets,
	addTargets,
	swatBoard,
	restart,
	removeTarget,
	activatePower,
	addPowers,
	removeExpiredPowers,
	removeActivatedPower,
	removeDeadTargets,
	swatTarget,
	computeScore,
	attackPlayer,
};

export default actions;
