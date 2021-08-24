/* eslint-disable no-magic-numbers */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */
import { secure } from '@laufire/utils/collection';
import config from '../core/config';
import PlayerManager from './playerManager';
import PowerManager from './powerManager';
import TargetManager from './targetManager';

describe('PlayerManager', () => {
	const { adjustScore, decreaseHealth, isAlive, increaseHealth,
		getHealthRatio, getHealthColor, penalize, getAttacked } = PlayerManager;

	const state = secure({
		health: 3,
		score: 10,
	});

	describe('adjustScore', () => {
		test('adjusts score while double is inactive', () => {
			const score = -5;

			const expectedResult = state.score + score;

			jest.spyOn(PowerManager, 'isActive')
				.mockImplementation(() => false);

			const result = adjustScore(state, score);

			expect(result).toEqual(expectedResult);
		});

		test('adjusts score as 2X while double is active', () => {
			const score = 5;
			const expectedResult = state.score
			+ (score * config.powers.double.effect.multiplier);

			jest.spyOn(PowerManager, 'isActive')
				.mockImplementation(() => true);

			const result = PlayerManager.adjustScore(state, score);

			expect(PowerManager.isActive).toHaveBeenCalledWith(state, 'double');
			expect(result).toEqual(expectedResult);
		});
	});

	test('decreaseHealth returns decreased health', () => {
		const context = {
			state,
		};
		const expectedResult = state.health - config.penalDamage;

		const result = decreaseHealth({ ...context,
			data: config.penalDamage });

		expect(result).toEqual(expectedResult);
	});

	describe('isAlive', () => {
		test('returns false if health is equal to zero', () => {
			const context = {
				state: { health: 0 },
			};

			const result = isAlive(context);

			expect(result).toEqual(false);
		});
		test('returns true if health is greater than zero', () => {
			const context = {
				state: { health: 3 },
			};

			const result = isAlive(context);

			expect(result).toEqual(true);
		});
	});
	describe('increaseHealth', () => {
		test('returns increased health while health is less than max limit',
			() => {
				const result = increaseHealth({ health: config.maxHealth - 1 },
					1);

				expect(result).toEqual(config.maxHealth);
			});
		test('returns the same health while health is greater than max limit',
			() => {
				const result = increaseHealth({ health: config.maxHealth }, 1);

				expect(result).toEqual(config.maxHealth);
			});
	});
	test('getHealthRatio returns the ratio between state health & max health',
		() => {
			const context = {
				state: { health: 73 },
			};

			const expectedResult = 0.73;

			const result = getHealthRatio(context);

			expect(result).toEqual(expectedResult);
		});

	test('getHealthColor returns the color according to health percentage',
		() => {
			const healthRatio = [0.93, 0.73, 0.23];

			const expectedResult = ['lightgreen', 'yellow', 'orangered'];

			const result = healthRatio.map(getHealthColor);

			expect(result).toEqual(expectedResult);
		});

	describe('penalize', () => {
		const context = {
			state,
			config,
		};

		test('penalize returns unchanged '
			+ 'health when the shield is active', () => {
			const returned = state.health;

			jest.spyOn(PowerManager, 'isActive').mockReturnValue(true);

			const result = penalize(context);

			expect(PowerManager.isActive).toHaveBeenCalledWith(state, 'shield');
			expect(result).toEqual(returned);
		});

		test('penalize returns decreased health'
		+ 'when the shield is inactive', () => {
			const expectedResult = context.state.health - config.penalDamage;

			jest.spyOn(PowerManager, 'isActive').mockReturnValue(false);

			const result = penalize(context);

			expect(result).toEqual(expectedResult);
		});
	});

	describe('getAttacked', () => {
		const context = {
			state,
		};

		test('getAttacked returns unchanged '
			+ 'health when the repellent is active', () => {
			const returned = state.health;

			jest.spyOn(PowerManager, 'isActive').mockReturnValue(true);

			const result = getAttacked(context);

			expect(PowerManager.isActive)
				.toHaveBeenCalledWith(state, 'repellent');
			expect(result).toEqual(returned);
		});

		test('getAttacked call attackPlayer'
		+ 'when the repellent is inactive', () => {
			const returned = Symbol('returned');

			jest.spyOn(PowerManager, 'isActive').mockReturnValue(false);
			jest.spyOn(TargetManager, 'attackPlayer').mockReturnValue(returned);

			const result = getAttacked(context);

			expect(TargetManager.attackPlayer).toHaveBeenCalledWith(context);
			expect(result).toEqual(returned);
		});
	});
});
