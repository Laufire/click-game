import { secure } from '@laufire/utils/collection';
import config from '../core/config';
import PlayerManager from './playerManager';

describe('PlayerManager', () => {
	const state = secure({
		lives: 3,
		score: 10,
	});

	test('adjustScore returns adjusted score', () => {
		const score = -5;
		const { adjustScore } = PlayerManager;

		const expectedResult = state.score + score;

		const result = adjustScore(state, score);

		expect(result).toEqual(expectedResult);
	});

	test('decreaseLives returns decreased lives', () => {
		const { decreaseLives } = PlayerManager;

		const expectedResult = state.lives - config.penalDamage;

		const result = decreaseLives({ state });

		expect(result).toEqual(expectedResult);
	});
});
