import config from '../core/config';
import PowerManager from './powerManager';

const adjustScore = (state, score) => Math.max(state.score
		+ (PowerManager.isDouble(state)
			? score * config.powers.double.effects.multiplier
			: score), 0);

const decreaseLives = ({ state }) =>
	(PowerManager.isShielded(state)
		? state.lives
		: state.lives - config.penalDamage);

const isAlive = (context) => context.state.lives !== 0;

const PlayerManager = {
	adjustScore,
	decreaseLives,
	isAlive,
};

export default PlayerManager;
