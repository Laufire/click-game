import config from '../core/config';
import PowerManager from './powerManager';

// TODO: combine getScore & increasescore and name it as adjust score.
const adjustScore = (state, score) =>
	Math.max(state.score + score, 0);

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
