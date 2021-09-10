/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import * as random from '@laufire/utils/random';
import TargetManager from '.';
import PlayerManager from '../playerManager';
import swatEffects from './swatEffects';
import context from '../../core/context';
import { rndBetween } from '@laufire/utils/random';

describe('targets', () => {
	const { butterfly, spoiler } = swatEffects;
	const hundred = 100;

	test('butterfly decrease health', () => {
		const state = {
			health: context.config.maxHealth,
		};
		const result = butterfly(state);
		const expectedResult = state.health - 1;

		expect(result).toMatchObject({ health: expectedResult });
	});

	test('spoiler return adjustScore', () => {
		const state = Symbol('state');
		const data = TargetManager.getTarget({ type: 'spoiler' });
		const adjustment = rndBetween(0, hundred);
		const adjustScore = Symbol('adjustScore');
		const { min, max } = data.effect.score;

		jest.spyOn(random, 'rndBetween').mockReturnValue(adjustment);
		jest.spyOn(PlayerManager, 'adjustScore').mockReturnValue(adjustScore);

		const result = spoiler(state, data);

		expect(random.rndBetween).toHaveBeenCalledWith(min, max);
		expect(PlayerManager.adjustScore)
			.toHaveBeenCalledWith(state, -adjustment);
		expect(result).toMatchObject({ score: adjustScore });
	});
});
