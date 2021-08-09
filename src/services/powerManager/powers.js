import { rndBetween, rndValue, rndValues } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../../core/config';
import TargetManager from '../targetManager';
import { adjustTime } from '../helperService';

const Powers = {
	bomb: (state) => {
		const { damage, targetsCount } = config.powers.bomb;
		const count = Math.min(targetsCount, state.targets.length);
		const impactedTargets = rndValues(state.targets, count);

		return {
			targets: TargetManager.decreaseTargetLives(
				state.targets, impactedTargets,
				// TODO: Need to add separate configuration for damage
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
		const { score, lives } = config.powers.gift;

		return rndBetween(0, 1)
			? { score: state.score + rndBetween(score.min, score.max) }
			: { lives: state.lives + lives };
	},

	spoiler: (state) => {
		const { score } = config.powers.spoiler;
		// TODO: Introduce player manager.

		return { score: Math.max(state.score
			-	rndBetween(score.min, score.max), 0) };
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
};

export default Powers;
