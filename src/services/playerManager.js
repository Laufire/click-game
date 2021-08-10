import config from '../core/config';

// TODO: combine getScore & increasescore and name it as adjust score.
const adjustScore = (state, score) =>
	Math.max(state.score + score, 0);

const decreaseLives = (state) => state.lives - config.penalDamage;

const PlayerManager = {
	adjustScore,
	decreaseLives,
};

export default PlayerManager;
