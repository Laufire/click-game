import { rndBetween, rndValue, rndValues } from '@laufire/utils/random';
import { keys, map } from '@laufire/utils/collection';
import config from '../../core/config';
import TargetManager from '../targetManager';
import { getVariance } from '../helpers';
import PlayerManager from '../playerManager';
import { getTransientPowers } from '../../core/helpers';
import { adjustTime } from '../timeService';

const Powers = {
	bomb: (state) => {
		const { damage, targetsCount } = config.powers.bomb.effect;
		const count = Math.min(targetsCount, state.targets.length);
		const impactedTargets = rndValues(state.targets, count);

		return {
			targets: TargetManager.decreaseTargetHealth(
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
		const { score, health } = config.powers.gift.effect;

		return rndBetween(0, 1)
			? { score: PlayerManager.adjustScore(state,
				rndBetween(score.min, score.max)) }
			: { health: PlayerManager.increaseHealth(state, health) };
	},

	nuke: (state) => {
		const { damage } = config.powers.nuke.effect;

		return {
			targets: TargetManager.decreaseTargetHealth(
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
