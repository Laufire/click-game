/* eslint-disable max-lines-per-function */
import { secure } from '@laufire/utils/collection';
import { rndBetween } from '@laufire/utils/lib';
import config from '../core/config';
import PlayerManager from './playerManager';
import PowerManager from './powerManager';
import TargetManager from './targetManager';

const hundred = 100;
const five = 5;
const seventyFive = 75;
const twentyFive = 25;

describe('PlayerManager', () => {
	const { adjustScore, decreaseHealth, isAlive, increaseHealth,
		getHealthRatio, getHealthColor, penalize, getAttacked } = PlayerManager;

	const state = secure({
		health: 3,
		score: 10,
	});

	describe('adjustScore', () => {
		const { multiplier } = config.powers.double.effect;
		const expectations = [
			['2x', 'active', true, five, state.score + (five * multiplier)],
			['1x', 'inactive', false, -five, state.score - five],
		];

		test.each(expectations)('adjusts score as %p while double is %p',
			(
				dummy, dummyOne, isActive, adjustment, expectation
			) => {
				jest.spyOn(PowerManager, 'isActive')
					.mockReturnValue(isActive);

				const result = adjustScore(state, adjustment);

				expect(PowerManager.isActive)
					.toHaveBeenCalledWith(state, 'double');
				expect(result).toEqual(expectation);
			});
	});

	test('decreaseHealth returns decreased health', () => {
		const expectedResult = state.health - config.penalDamage;

		const result = decreaseHealth({ state: state,
			data: config.penalDamage });

		expect(result).toEqual(expectedResult);
	});

	describe('isAlive', () => {
		const expectations = [
			[false, 'equal to', { state: { health: 0 }}],
			[true, 'greater than', { state: { health: 3 }}],
		];

		test.each(expectations)('returns %p if health is %p zero',
			(
				expectation, dummy, context
			) => {
				expect(isAlive(context)).toEqual(expectation);
			});
	});

	describe('increaseHealth', () => {
		const expectations = [
			['increased', 'less', { health: config.maxHealth - 1 }],
			['same', 'greater', { health: config.maxHealth }],
		];

		test.each(expectations)('returns the %p health while health'
		+ ' is %p than max limit', (
			dummy, dummyOne, expectation
		) => {
			const result = increaseHealth(expectation, 1);

			expect(result).toEqual(config.maxHealth);
		});
	});

	test('getHealthRatio returns the ratio between state health & max health',
		() => {
			const health = rndBetween(0, hundred);
			const expectedResult = health / config.maxHealth;

			const result = getHealthRatio({ state: { health }});

			expect(result).toEqual(expectedResult);
		});

	test('getHealthColor returns the color according to health percentage',
		() => {
			const healthRatio = [
				rndBetween(seventyFive, hundred) / hundred,
				rndBetween(twentyFive, seventyFive - 1) / hundred,
				rndBetween(0, twentyFive - 1) / hundred,
			];

			const expectedResult = ['lightgreen', 'yellow', 'orangered'];

			const result = healthRatio.map(getHealthColor);

			expect(result).toEqual(expectedResult);
		});

	describe('penalize', () => {
		const context = {
			state,
			config,
		};
		const { health } = context.state;
		const expectations = [
			['unchanged', 'active', true, health],
			['decreased', 'inactive', false, health - config.penalDamage],
		];

		test.each(expectations)('penalize returns %p health'
		+ ' when the shield is %p', (
			dummy, dummyOne, isActive, expectation
		) => {
			jest.spyOn(PowerManager, 'isActive').mockReturnValue(isActive);

			const result = penalize(context);

			expect(result).toEqual(expectation);
		});
	});

	describe('getAttacked', () => {
		const context = {
			state,
		};

		const returnedValue = Symbol('returned');
		const expectations = [
			['returns unchanged health', 'active', true, state.health],
			['call attackPlayer', 'inactive', false, returnedValue],
		];

		test.each(expectations)('getAttacked %p'
		+ ' when the repellent is %p', (
			dummy, dummyOne, isActive, returned
		) => {
			jest.spyOn(PowerManager, 'isActive').mockReturnValue(isActive);
			jest.spyOn(TargetManager, 'attackPlayer').mockReturnValue(returned);

			const result = getAttacked(context);

			isActive
				? expect(TargetManager.attackPlayer).not.toHaveBeenCalled()
				: expect(TargetManager.attackPlayer)
					.toHaveBeenCalledWith(context);
			expect(result).toEqual(returned);
		});
	});
});
