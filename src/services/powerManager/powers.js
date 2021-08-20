import { rndBetween, rndValue, rndValues } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../../core/config';
import TargetManager from '../targetManager';
import { adjustTime } from '../helperService';

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
		const { duration } = config.powers.ice;

		return {
			frozenTill: adjustTime(
				state.frozenTill,
				rndBetween(duration.min, duration.max),
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
			? { score: state.score + rndBetween(score.min, score.max) }
			: { lives: state.lives + lives };
	},

	superBat: (state) => {
		const { duration } = config.powers.superBat;

		return {
			superTill: adjustTime(
				state.superTill,
				duration,
				'seconds',
			),
		};
	},

	shield: (state) => {
		const { duration } = config.powers.shield;

		return {
			shieldTill: adjustTime(
				state.shieldTill,
				duration,
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
		const { duration } = config.powers.double;

		return {
			doubleTill: adjustTime(
				state.doubleTill,
				duration,
				'seconds',
			),
		};
	},
};

export default Powers;
