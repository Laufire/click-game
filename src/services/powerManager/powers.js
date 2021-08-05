import { rndBetween, rndValue } from '@laufire/utils/random';
import { keys } from '@laufire/utils/collection';
import config from '../../core/config';
import TargetManager from '../targetManager';

const Powers = {
	bomb: (state) => {
		const impactedTargets = TargetManager.getRandomTargets(state.targets);
		const { targetsCount } = config.powers.bomb;

		return {
			targets: TargetManager.decreaseTargetLives(
				state.targets, impactedTargets,
				rndBetween(targetsCount.min, targetsCount.max)
			),
		};
	},

	ice: (state) => {
		const { duration } = config.powers.ice;

		return {
			frozenTill:	state.frozenTill.add(rndBetween(duration.min,
				duration.max), 'seconds'),
		};
	},

	surprise: (state) => {
		const randomPower = rndValue(keys(Powers)
			.filter((data) => data !== 'surprise'));

		return Powers[randomPower](state);
	},

	gift: (state) => {
		const { score } = config.powers.gift;

		return rndBetween(0, 1)
			? { score: state.score + rndBetween(score.min, score.max) }
			: { lives: state.lives + 1 };
	},

	spoiler: (state) => {
		const { score } = config.powers.spoiler;

		return 	{ score: state.score - rndBetween(score.min, score.max) };
	},

	superBat: (state) => {
		const { duration } = config.powers.superBat;

		return {
			superTill: state.superTill.add(duration, 'seconds'),
		};
	},
};

export default Powers;
