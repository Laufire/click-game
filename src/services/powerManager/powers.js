import { rndBetween, rndValue, rndValues } from '@laufire/utils/random';
import { keys, map } from '@laufire/utils/collection';
import config from '../../core/config';
import TargetManager from '../targetManager';
import { adjustTime, getVariance } from '../helperService';
import PlayerManager from '../playerManager';
import { getTransientPowers } from '../../core/helpers';

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

	nuke: (state) => {
		const { damage } = config.powers.nuke.effect;

		return {
			targets: TargetManager.decreaseTargetLives(
				state.targets, state.targets, damage
			),
			powers: [],
		};
	},

	...map(getTransientPowers(), ({ duration, variance }, powerKey) =>
		(state) => ({
			duration: {
				...duration,
				[powerKey]: adjustTime(
					state.duration[powerKey],
					getVariance(variance) * duration,
					'seconds'
				),
			},
		})),
};

export default Powers;
