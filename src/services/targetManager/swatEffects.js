import { rndBetween } from '@laufire/utils/random';
import PlayerManager from '../playerManager';

const swatEffects = {
	butterfly: (state) => ({
		health: state.health - 1,
	}),
	spoiler: (state, data) => ({
		score: PlayerManager.adjustScore(state,
			-rndBetween(data.effect.score.min, data.effect.score.max)),
	}),
};

export default swatEffects;
