import config from '../core/config';
import PowerManager from './powerManager';

const hundred = 100;

const adjustScore = (state, score) => Math.max(state.score
		+ (PowerManager.isActive(state, 'double')
			? score * config.powers.double.effect.multiplier
			: score), 0);

const decreaseLives = ({ state }) =>
	(PowerManager.isActive(state, 'shield')
		? state.lives
		: state.lives - config.penalDamage);

const increaseLives = (state, lives) =>
	Math.min(state.lives + lives, config.maxLives);

const getHealthRatio = ({ state }) =>
	state.lives / config.maxLives;

const getHealthColor = (healthRatio) =>
	config.healthBar.colors[
		Math.floor((healthRatio * hundred) / config.healthBar.interval)
		* config.healthBar.interval];

const isAlive = (context) => context.state.lives !== 0;

const PlayerManager = {
	adjustScore,
	decreaseLives,
	increaseLives,
	getHealthRatio,
	getHealthColor,
	isAlive,
};

export default PlayerManager;
