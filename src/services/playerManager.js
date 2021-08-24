import config from '../core/config';
import PowerManager from './powerManager';
import TargetManager from './targetManager';

const hundred = 100;

const adjustScore = (state, score) => Math.max(state.score
		+ (PowerManager.isActive(state, 'double')
			? score * config.powers.double.effect.multiplier
			: score), 0);

const decreaseHealth = ({ state, data: damage }) =>
	Math.max(state.health - damage, 0);

const increaseHealth = (state, health) =>
	Math.min(state.health + health, config.maxHealth);

const getHealthRatio = ({ state }) =>
	state.health / config.maxHealth;

const getHealthColor = (healthRatio) =>
	config.healthBar.colors[
		Math.floor((healthRatio * hundred) / config.healthBar.interval)
		* config.healthBar.interval];

const isAlive = (context) => context.state.health !== 0;

const penalize = (context) => (
	PowerManager.isActive(context.state, 'shield')
		? context.state.health
		: decreaseHealth({ ...context, data: context.config.penalDamage })
);

const getAttacked = (context) => (
	PowerManager.isActive(context.state, 'repellent')
		? context.state.health
		: TargetManager.attackPlayer(context)
);

const PlayerManager = {
	adjustScore,
	decreaseHealth,
	increaseHealth,
	getHealthRatio,
	getHealthColor,
	isAlive,
	penalize,
	getAttacked,
};

export default PlayerManager;
