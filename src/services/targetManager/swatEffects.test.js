/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import * as random from '@laufire/utils/random';
import TargetManager from '.';
import PlayerManager from '../playerManager';
import swatEffects from './swatEffects';

describe('targets', () => {
	const { butterfly, spoiler } = swatEffects;

	test('butterfly decrease health', () => {
		const health = 5;
		const state = {
			health,
		};
		const result = butterfly(state);
		const expectedResult = health - 1;

		expect(result).toMatchObject({ health: expectedResult });
	});

	test('spoiler return adjustScore', () => {
		const state = Symbol('state');
		const data = TargetManager.getTarget({ type: 'spoiler' });
		const rnd = 5;
		const adjustScore = Symbol('adjustScore');
		const { min, max } = data.effect.score;

		jest.spyOn(random, 'rndBetween').mockReturnValue(rnd);
		jest.spyOn(PlayerManager, 'adjustScore').mockReturnValue(adjustScore);

		const result = spoiler(state, data);

		expect(random.rndBetween).toHaveBeenCalledWith(min, max);
		expect(PlayerManager.adjustScore).toHaveBeenCalledWith(state, -rnd);
		expect(result).toMatchObject({ score: adjustScore });
	});
});
