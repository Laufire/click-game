import config from '../core/config';
import PowerManager from './powerManager';
import TargetManager from './targetManager';

const hundred = 100;

const adjustScore = (state, score) => Math.max(state.score
		+ (PowerManager.isActive(state, 'double')
			? score * config.powers.double.effect.multiplier
			: score), 0);

const decreaseLives = ({ state, data: damage }) =>
	Math.max(state.lives - damage, 0);

const increaseLives = (state, lives) =>
	Math.min(state.lives + lives, config.maxLives);

const getHealthRatio = ({ state }) =>
	state.lives / config.maxLives;

const getHealthColor = (healthRatio) =>
	config.healthBar.colors[
		Math.floor((healthRatio * hundred) / config.healthBar.interval)
		* config.healthBar.interval];

const isAlive = (context) => context.state.lives !== 0;

const penalize = (context) => (
	PowerManager.isActive(context.state, 'shield')
		? context.state.lives
		: decreaseLives({ ...context, data: context.config.penalDamage })
);

const getAttacked = (context) => (
	PowerManager.isActive(context.state, 'repellent')
		? context.state.lives
		: TargetManager.attackPlayer(context)
);

const PlayerManager = {
	adjustScore,
	decreaseLives,
	increaseLives,
	getHealthRatio,
	getHealthColor,
	isAlive,
	penalize,
	getAttacked,
};

export default PlayerManager;
