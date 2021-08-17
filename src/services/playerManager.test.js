/* eslint-disable max-lines-per-function */
import { secure } from '@laufire/utils/collection';
import config from '../core/config';
import PlayerManager from './playerManager';
import PowerManager from './powerManager';

describe('PlayerManager', () => {
	const { adjustScore, decreaseLives, isAlive } = PlayerManager;
	const state = secure({
		lives: 3,
		score: 10,
	});

	test('adjustScore returns adjusted score', () => {
		const score = -5;

		const expectedResult = state.score + score;

		const result = adjustScore(state, score);

		expect(result).toEqual(expectedResult);
	});

	test('decreaseLives returns unchanged '
		+ 'lives when the shield is active', () => {
		const expectedResult = state.lives;

		jest.spyOn(PowerManager, 'isShielded').mockReturnValue(true);

		const result = decreaseLives({ state });

		expect(PowerManager.isShielded).toHaveBeenCalledWith(state);
		expect(result).toEqual(expectedResult);
	});

	test('decreaseLives returns decreased lives'
	+ 'when the shield is inactive', () => {
		const expectedResult = state.lives - config.penalDamage;

		jest.spyOn(PowerManager, 'isShielded').mockReturnValue(false);

		const result = decreaseLives({ state });

		expect(PowerManager.isShielded).toHaveBeenCalledWith(state);
		expect(result).toEqual(expectedResult);
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
});
