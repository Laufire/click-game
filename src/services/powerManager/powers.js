import { rndBetween, rndValue, rndValues } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../../core/config';
import TargetManager from '../targetManager';
import { adjustTime, getVariance } from '../helperService';
import PlayerManager from '../playerManager';

const Powers = {
	bomb: (state) => {
		const { damage, targetsCount } = config.powers.bomb.effect;
		const count = Math.min(targetsCount, state.targets.length);
		const impactedTargets = rndValues(state.targets, count);

		return {
			targets: TargetManager.decreaseTargetLives(
				state.targets, impactedTargets,
				rndBetween(damage.min, damage.max)
			),
		};
	},

	ice: (state) => {
		const { duration, variance } = config.powers.ice;
		const adjustment = getVariance(variance) * duration;

		return {
			frozenTill: adjustTime(
				state.frozenTill,
				adjustment,
				'seconds'
			),
		};
	},

	surprise: (state) => {
		const randomPower = rndValue(keys(Powers)
			.filter((data) => data !== 'surprise'));

		return Powers[randomPower](state);
	},

	gift: (state) => {
		const { score, lives } = config.powers.gift.effect;

		return rndBetween(0, 1)
			? { score: PlayerManager.adjustScore(state,
				rndBetween(score.min, score.max)) }
			: { lives: PlayerManager.increaseLives(state, lives) };
	},

	superBat: (state) => {
		const { duration, variance } = config.powers.superBat;
		const adjustment = getVariance(variance) * duration;

		return {
			superTill: adjustTime(
				state.superTill,
				adjustment,
				'seconds',
			),
		};
	},

	shield: (state) => {
		const { duration, variance } = config.powers.shield;
		const adjustment = getVariance(variance) * duration;

		return {
			shieldTill: adjustTime(
				state.shieldTill,
				adjustment,
				'seconds',
			),
		};
	},

	nuke: (state) => {
		const { damage } = config.powers.nuke.effect;

		return {
			targets: TargetManager.decreaseTargetLives(
				state.targets, state.targets, damage
			),
			powers: [],
		};
	},

	double: (state) => {
		const { duration, variance } = config.powers.double;
		const adjustment = getVariance(variance) * duration;

		return {
			doubleTill: adjustTime(
				state.doubleTill,
				adjustment,
				'seconds',
			),
		};
	},
};

export default Powers;
