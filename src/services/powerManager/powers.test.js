/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
import Powers from './powers';
import config from '../../core/config';
import Mock from '../../../test/mock';
import * as random from '@laufire/utils/random';
import * as collection from '@laufire/utils/collection';
import * as helper from '../helpers';
import TargetManager from '../targetManager';
import PlayerManager from '../playerManager';
import { getTransientPowers } from '../../core/helpers';
import { map } from '@laufire/utils/collection';
import * as timeService from '../timeService';

describe('Powers', () => {
	const { bomb, gift, surprise, nuke } = Powers;

	describe('bomb', () => {
		const randomTargets = Mock.getRandomTargets();
		const { min, max } = config.powers.bomb.effect.damage;
		const { targetsCount } = config.powers.bomb.effect;
		const targets = [Symbol('target')];
		const count = Symbol('count');
		const damage = Symbol('damage');

		test('bomb', () => {
			jest.spyOn(Math,
				'min').mockReturnValue(count);
			jest.spyOn(random,
				'rndValues').mockReturnValue(randomTargets);
			jest.spyOn(random,
				'rndBetween').mockReturnValue(damage);
			jest.spyOn(TargetManager,
				'decreaseTargetHealth').mockReturnValue(targets);

			const result = bomb({ targets });

			expect(Math.min)
				.toHaveBeenCalledWith(targetsCount, targets.length);
			expect(random.rndValues).toHaveBeenCalledWith(targets, count);
			expect(random.rndBetween)
				.toHaveBeenCalledWith(min, max);
			expect(TargetManager.decreaseTargetHealth).toHaveBeenCalledWith(
				targets, randomTargets, damage
			);
			expect(result).toMatchObject({ targets });
		});
	});

	describe('gift randomly increases the score or health', () => {
		const adjustment = Symbol('adjustment');
		const { score, health } = config.powers.gift.effect;
		const state = Symbol('state');
		const returnValue = Symbol('returnValue');

		test('gift sometimes increase the score', () => {
			jest.spyOn(random, 'rndBetween')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce(adjustment);
			jest.spyOn(PlayerManager, 'adjustScore')
				.mockReturnValue(returnValue);

			const result = gift(state);

			expect(PlayerManager.adjustScore)
				.toHaveBeenLastCalledWith(state, adjustment);
			expect(random.rndBetween)
				.toHaveBeenCalledWith(score.min, score.max);
			expect(result).toMatchObject({
				score: returnValue,
			});
		});

		test('gift sometimes increase the health', () => {
			jest.spyOn(random, 'rndBetween')
				.mockReturnValue(0);
			jest.spyOn(PlayerManager, 'increaseHealth')
				.mockReturnValue(returnValue);

			const result = gift(state);

			expect(PlayerManager.increaseHealth)
				.toHaveBeenCalledWith(state, health);
			expect(result).toMatchObject({
				health: returnValue,
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
			jest.spyOn(random, 'rndValue').mockReturnValue(power);
			jest.spyOn(Powers, power).mockReturnValue(returnValue);

			const result = surprise(state);

			expect(collection.keys).toHaveBeenCalledWith(Powers);
			expect(random.rndValue)
				.toHaveBeenCalledWith(filteredPowerKeys);
			expect(Powers[power]).toHaveBeenCalledWith(state);
			expect(result).toEqual(returnValue);
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
				'decreaseTargetHealth').mockReturnValue(targets);

			const result = nuke(state);

			expect(TargetManager.decreaseTargetHealth).toHaveBeenCalledWith(
				state.targets, state.targets, damage
			);
			expect(result).toMatchObject(expectedResult);
		});
	});

	describe('Transient Powers', () => {
		map(getTransientPowers(), ({ duration, variance }, power) => {
			const newTime = Symbol('newTime');
			const state = {
				duration: { [power]: Symbol(power) },
			};
			const adjustment = variance * duration;
			const second = 'seconds';

			test(power, () => {
				jest.spyOn(timeService, 'adjustTime')
					.mockReturnValue(newTime);

				jest.spyOn(helper, 'getVariance')
					.mockReturnValue(variance);

				const result = Powers[power](state);

				expect(helper.getVariance)
					.toHaveBeenCalledWith(variance);
				expect(timeService.adjustTime)
					.toHaveBeenCalledWith(
						state.duration[power], adjustment, second
					);
				expect(result).toMatchObject({ duration: {
					[power]: newTime,
				}});
			});
		});
	});
});
