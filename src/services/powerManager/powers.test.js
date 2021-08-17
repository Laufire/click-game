/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
import Powers from './powers';
import config from '../../core/config';
import Mock from '../../../test/mock';
import * as random from '@laufire/utils/random';
import * as collection from '@laufire/utils/collection';
import * as helper from '../helperService';
import TargetManager from '../targetManager';

describe('Powers', () => {
	const { bomb, ice, superBat, gift, surprise, shield } = Powers;

	describe('bomb', () => {
		const randomTargets = Mock.getRandomTargets();
		const { min, max } = config.powers.bomb.damage;
		const { targetsCount } = config.powers.bomb;
		const targets = [Symbol('target')];
		const count = Symbol('count');
		const damage = Symbol('damage');

		test('bomb', () => {
			jest.spyOn(Math,
				'min').mockImplementation(() => count);
			jest.spyOn(random,
				'rndValues').mockImplementation(() =>
				randomTargets);
			jest.spyOn(random,
				'rndBetween').mockImplementation(() => damage);
			jest.spyOn(TargetManager,
				'decreaseTargetLives').mockImplementation(() =>
				targets);

			const result = bomb({ targets });

			expect(Math.min)
				.toHaveBeenCalledWith(targetsCount, targets.length);

			expect(random.rndValues).toHaveBeenCalledWith(targets, count);

			expect(random.rndBetween)
				.toHaveBeenCalledWith(min, max);

			expect(TargetManager.decreaseTargetLives).toHaveBeenCalledWith(
				targets, randomTargets, damage
			);

			expect(result).toMatchObject({ targets });
		});
	});

	describe('ice', () => {
		const newTime = Symbol('newTime');
		const frozenTill = Symbol('frozenTill');
		const state = {
			frozenTill,
		};
		const frozenDuration = Symbol('frozenDuration');
		const { duration } = config.powers.ice;
		const second = 'seconds';

		test('ice return the frozenTill', () => {
			jest.spyOn(helper, 'adjustTime')
				.mockImplementation(() => newTime);

			jest.spyOn(random, 'rndBetween')
				.mockImplementation(() => frozenDuration);

			const result = ice(state);

			expect(random.rndBetween)
				.toHaveBeenCalledWith(duration.min, duration.max);
			expect(helper.adjustTime)
				.toHaveBeenCalledWith(
					frozenTill, frozenDuration, second
				);
			expect(result).toMatchObject({
				frozenTill: newTime,
			});
		});
	});

	describe('superBat', () => {
		const newTime = Symbol('newTime');
		const superTill = Symbol('superTill');
		const state = {
			superTill,
		};
		const { duration } = config.powers.superBat;
		const second = 'seconds';

		test('superBat return the superTill', () => {
			jest.spyOn(helper, 'adjustTime')
				.mockImplementation(() => newTime);

			const result = superBat(state);

			expect(helper.adjustTime)
				.toHaveBeenCalledWith(
					superTill, duration, second
				);
			expect(result).toMatchObject({
				superTill: newTime,
			});
		});
	});

	describe('gift randomly increases the score or lives', () => {
		const score = 5;
		const lives = 3;
		const addScore = 5;
		const state = {
			score,
			lives,
		};

		test('gift sometimes increase the score', () => {
			const { min, max } = config.powers.gift.score;

			jest.spyOn(random, 'rndBetween')
				.mockImplementationOnce(() => 1)
				.mockImplementationOnce(() => addScore);

			const result = gift(state);

			expect(random.rndBetween)
				.toHaveBeenCalledWith(min, max);
			expect(result).toMatchObject({
				score: score + addScore,
			});
		});

		test('gift sometimes increase the lives', () => {
			jest.spyOn(random, 'rndBetween')
				.mockImplementation(() => 0);

			const result = gift(state);

			expect(result).toMatchObject({
				lives: lives + config.powers.gift.lives,
			});
		});
	});

	describe('surprise', () => {
		const state = Symbol('state');
		const returnValue = Symbol('returnValue');

		test('surprise return rnd power', () => {
			const filteredPowerKeys = collection.keys(Powers)
				.filter((data) => data !== 'surprise');
			const power = random.rndValue(filteredPowerKeys);

			jest.spyOn(collection, 'keys');
			jest.spyOn(random, 'rndValue').mockImplementation(() => power);
			jest.spyOn(Powers, power).mockImplementation(() => returnValue);

			const result = surprise(state);

			expect(collection.keys).toHaveBeenCalledWith(Powers);
			expect(random.rndValue)
				.toHaveBeenCalledWith(filteredPowerKeys);
			expect(Powers[power]).toHaveBeenCalledWith(state);
			expect(result).toEqual(returnValue);
		});
	});

	describe('shield', () => {
		const newTime = Symbol('newTime');
		const shieldTill = Symbol('shieldTill');
		const state = {
			shieldTill,
		};
		const { duration } = config.powers.shield;
		const second = 'seconds';

		test('shield returns the shieldTill', () => {
			jest.spyOn(helper, 'adjustTime')
				.mockImplementation(() => newTime);

			const result = shield(state);

			expect(helper.adjustTime)
				.toHaveBeenCalledWith(
					shieldTill, duration, second
				);
			expect(result).toMatchObject({
				shieldTill: newTime,
			});
		});
	});
});
