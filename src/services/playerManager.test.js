/* eslint-disable no-magic-numbers */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */
import { secure } from '@laufire/utils/collection';
import config from '../core/config';
import PlayerManager from './playerManager';
import PowerManager from './powerManager';

describe('PlayerManager', () => {
	const { adjustScore, decreaseLives, isAlive, increaseLives,
		getHealthRatio, getHealthColor } = PlayerManager;

	const state = secure({
		lives: 3,
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

	describe('decreaseLives', () => {
		const context = {
			state,
		};

		test('decreaseLives returns unchanged '
		+ 'lives when the shield is active', () => {
			const expectedResult = state.lives;

			jest.spyOn(PowerManager, 'isActive').mockReturnValue(true);

			const result = decreaseLives({ ...context,
				data: config.penalDamage });

			expect(PowerManager.isActive).toHaveBeenCalledWith(state, 'shield');
			expect(result).toEqual(expectedResult);
		});

		test('decreaseLives returns decreased lives'
	+ 'when the shield is inactive', () => {
			const expectedResult = state.lives - config.penalDamage;

			jest.spyOn(PowerManager, 'isActive').mockReturnValue(false);

			const result = decreaseLives({ ...context,
				data: config.penalDamage });

			expect(PowerManager.isActive).toHaveBeenCalledWith(state, 'shield');
			expect(result).toEqual(expectedResult);
		});
	});

	describe('isAlive', () => {
		test('returns false if lives is equal to zero', () => {
			const context = {
				state: { lives: 0 },
			};

			const result = isAlive(context);

			expect(result).toEqual(false);
		});
		test('returns true if lives is greater than zero', () => {
			const context = {
				state: { lives: 3 },
			};

			const result = isAlive(context);

			expect(result).toEqual(true);
		});
	});
	describe('increaseLives', () => {
		test('returns increased lives while lives is less than max limit',
			() => {
				const result = increaseLives({ lives: config.maxLives - 1 }, 1);

				expect(result).toEqual(config.maxLives);
			});
		test('returns the same lives while lives is greater than max limit',
			() => {
				const result = increaseLives({ lives: config.maxLives }, 1);

				expect(result).toEqual(config.maxLives);
			});
	});
	test('getHealthRatio returns the ratio between state lives & max lives',
		() => {
			const context = {
				state: { lives: 73 },
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
});
