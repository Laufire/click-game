import config from '../core/config';
import PowerManager from './powerManager';
import TargetManager from './targetManager';

const hundred = 100;

const PlayerManager = {
	adjustScore: (state, score) => Math.max(state.score
		+ (PowerManager.isActive(state, 'double')
			? score * config.powers.double.effect.multiplier
			: score), 0),

	decreaseHealth: ({ state, data: damage }) =>
		Math.max(state.health - damage, 0),

	increaseHealth: (state, health) =>
		Math.min(state.health + health, config.maxHealth),

	getHealthRatio: ({ state }) => state.health / config.maxHealth,

	getHealthColor: (healthRatio) =>
		config.healthBar.colors[
			Math.floor((healthRatio * hundred) / config.healthBar.interval)
			* config.healthBar.interval],

	isAlive: (context) => context.state.health !== 0,

	penalize: (context) => (
		PowerManager.isActive(context.state, 'shield')
			? context.state.health
			: PlayerManager.decreaseHealth({ ...context,
				data: context.config.penalDamage })
	),

	getAttacked: (context) => (
		PowerManager.isActive(context.state, 'repellent')
			? context.state.health
			: TargetManager.attackPlayer(context)
	),
};

export default PlayerManager;
