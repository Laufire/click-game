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
import PlayerManager from '../playerManager';

describe('Powers', () => {
	const { bomb, ice, superBat, gift, surprise, shield, nuke, double }
		= Powers;

	describe('bomb', () => {
		const randomTargets = Mock.getRandomTargets();
		const { min, max } = config.powers.bomb.effect.damage;
		const { targetsCount } = config.powers.bomb.effect;
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
		const state = {
			duration: { ice: Symbol('ice') },
		};
		const { duration, variance } = config.powers.ice;
		const adjustment = variance * duration;
		const second = 'seconds';

		test('ice return the frozenTill', () => {
			jest.spyOn(helper, 'adjustTime')
				.mockImplementation(() => newTime);

			jest.spyOn(helper, 'getVariance')
				.mockImplementation(() => variance);

			const result = ice(state);

			expect(helper.getVariance)
				.toHaveBeenCalledWith(variance);
			expect(helper.adjustTime)
				.toHaveBeenCalledWith(
					state.duration.ice, adjustment, second
				);
			expect(result).toMatchObject({ duration: {
				ice: newTime,
			}});
		});
	});

	describe('superBat', () => {
		const newTime = Symbol('newTime');
		const state = {
			duration: { superBat: Symbol('superBat') },
		};
		const { duration, variance } = config.powers.superBat;
		const adjustment = variance * duration;
		const second = 'seconds';

		test('superBat return the superTill', () => {
			jest.spyOn(helper, 'adjustTime')
				.mockImplementation(() => newTime);
			jest.spyOn(helper, 'getVariance')
				.mockImplementation(() => variance);

			const result = superBat(state);

			expect(helper.getVariance).toHaveBeenCalledWith(variance);
			expect(helper.adjustTime)
				.toHaveBeenCalledWith(
					state.duration.superBat, adjustment, second
				);
			expect(result).toMatchObject({ duration: {
				superBat: newTime,
			}});
		});
	});

	describe('gift randomly increases the score or lives', () => {
		const score = 5;
		const lives = 3;
		const addScore = Symbol('score');
		const addLife = config.powers.gift.effect.lives;
		const state = {
			score,
			lives,
		};

		test('gift sometimes increase the score', () => {
			const { min, max } = config.powers.gift.effect.score;

			jest.spyOn(random, 'rndBetween')
				.mockImplementationOnce(() => 1)
				.mockImplementationOnce(() => addScore);
			jest.spyOn(PlayerManager, 'adjustScore')
				.mockImplementation(() => addScore);

			const result = gift(state);

			expect(PlayerManager.adjustScore)
				.toHaveBeenLastCalledWith(state, addScore);
			expect(random.rndBetween)
				.toHaveBeenCalledWith(min, max);
			expect(result).toMatchObject({
				score: addScore,
			});
		});

		test('gift sometimes increase the lives', () => {
			jest.spyOn(random, 'rndBetween')
				.mockImplementation(() => 0);
			jest.spyOn(PlayerManager, 'increaseLives');

			const result = gift(state);

			expect(PlayerManager.increaseLives)
				.toHaveBeenCalledWith(state, addLife);
			expect(result).toMatchObject({
				lives: lives + addLife,
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
		const state = {
			duration: { shield: Symbol('shield') },
		};
		const { duration, variance } = config.powers.shield;
		const adjustment = variance * duration;
		const second = 'seconds';

		test('shield returns the shieldTill', () => {
			jest.spyOn(helper, 'getVariance')
				.mockImplementation(() => variance);
			jest.spyOn(helper, 'adjustTime')
				.mockImplementation(() => newTime);

			const result = shield(state);

			expect(helper.getVariance).toHaveBeenCalledWith(variance);
			expect(helper.adjustTime)
				.toHaveBeenCalledWith(
					state.duration.shield, adjustment, second
				);
			expect(result).toMatchObject({ duration: {
				shield: newTime,
			}});
		});
	});

	describe('nuke', () => {
		const targets = [Symbol('target')];
		const powers = [];
		const state = {
			targets,
		};
		const { damage } = config.powers.nuke.effect;
		const expectedResult = {
			targets,
			powers,
		};

		test('Returns modified targets and powers', () => {
			jest.spyOn(TargetManager,
				'decreaseTargetLives').mockImplementation(() =>
				targets);

			const result = nuke(state);

			expect(TargetManager.decreaseTargetLives).toHaveBeenCalledWith(
				state.targets, state.targets, damage
			);
			expect(result).toMatchObject(expectedResult);
		});
	});

	describe('double', () => {
		const newTime = Symbol('newTime');
		const state = {
			duration: { double: Symbol('double') },
		};
		const { duration, variance } = config.powers.double;
		const adjustment = variance * duration;
		const second = 'seconds';

		test('double return the doubleTill', () => {
			jest.spyOn(helper, 'adjustTime')
				.mockImplementation(() => newTime);
			jest.spyOn(helper, 'getVariance')
				.mockImplementation(() => variance);

			const result = double(state);

			expect(helper.getVariance).toHaveBeenCalledWith(variance);
			expect(helper.adjustTime)
				.toHaveBeenCalledWith(
					state.duration.double, adjustment, second
				);
			expect(result).toMatchObject({ duration: {
				double: newTime,
			}});
		});
	});
});
