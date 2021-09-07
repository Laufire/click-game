/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */

import * as random from '@laufire/utils/random';
import TargetManager from '../targetManager';
import config from '../../core/config';
import { keys, map, range, secure } from '@laufire/utils/collection';
import { replace } from '../../../test/helpers';
import * as PositionService from '../positionService';
import * as helpers from '../helpers';
import Mocks from '../../../test/mock';
import PowerManager from '../powerManager';
import PlayerManager from '../playerManager';
import * as timeService from '../timeService';
import swatEffects from './swatEffects';

describe('TargetManager', () => {
	const { addTargets, getTarget, swatTarget, decreaseTargetHealth,
		moveTargets, getExpiredTargets, attackPlayer, spawnTargets, isDead,
		reproduceTargets, getKilledTargets,
		getTargetsScore, removeTargets } = TargetManager;
	const { allTargets, targets,
		withEffect, withoutEffect, getRandomTargets } = Mocks;
	const x = Symbol('x');
	const y = Symbol('y');
	const id = Symbol('id');
	const [target] = getRandomTargets();
	const { type } = target;

	describe('addTargets adds target', () => {
		test('returns targets with new targets added', () => {
			const returnSpawnTargets = [Symbol('spawnTargets')];
			const returnReproduceTargets = [Symbol('reproduceTargets')];
			const currentTargets = getRandomTargets(config.maxTargets - 1);

			jest.spyOn(helpers, 'isProbable')
				.mockReturnValue(1);
			jest.spyOn(TargetManager, 'spawnTargets')
				.mockReturnValue(returnSpawnTargets);
			jest.spyOn(TargetManager, 'reproduceTargets')
				.mockReturnValue(returnReproduceTargets);

			const result = addTargets({ state: { targets: currentTargets }});
			const expectedResult = [
				...currentTargets,
				...returnSpawnTargets,
				...returnReproduceTargets,
			];

			expect(TargetManager.spawnTargets).toHaveBeenCalledWith();
			expect(TargetManager.reproduceTargets)
				.toHaveBeenCalledWith(currentTargets);
			expect(result).toEqual(expectedResult);
		});

		test('returns the targets without any new targets', () => {
			const maxTargets = range(0, config.maxTargets).map(() => target);
			const result = addTargets({ state: { targets: maxTargets }});

			expect(result).toEqual(maxTargets);
		});
	});

	describe('getTarget returns target', () => {
		const adjustedTime = Symbol('adjustedTime');
		const livesTill = adjustedTime;
		const currentTime = Symbol('currentTime');
		const typeConfig = config.targets[type];
		const { variance } = typeConfig;
		const { height, width } = typeConfig;
		const lifespan = typeConfig.lifespan * variance;
		const size = {
			height: height * variance,
			width: width * variance,
		};

		test('returns a target while params are passed', () => {
			jest.spyOn(helpers, 'getId')
				.mockReturnValue(id);
			jest.spyOn(helpers, 'getVariance')
				.mockReturnValue(variance);
			jest.spyOn(timeService, 'adjustTime')
				.mockReturnValue(adjustedTime);
			jest.spyOn(Date, 'now').mockReturnValue(currentTime);

			const expectedResult = {
				id,
				x,
				y,
				type,
				livesTill,
				...typeConfig,
				...size,
			};

			const result = getTarget({ x, y, type });

			expect(helpers.getId).toHaveBeenCalled();
			expect(helpers.getVariance).toHaveBeenCalledWith(variance);
			expect(timeService.adjustTime).toHaveBeenCalledWith(
				currentTime, lifespan, 'seconds'
			);
			expect(result).toMatchObject(expectedResult);
		});

		test('getTarget params are optional', () => {
			jest.spyOn(helpers, 'getId')
				.mockReturnValue(id);
			jest.spyOn(random, 'rndValue')
				.mockReturnValue(type);
			jest.spyOn(helpers, 'getVariance')
				.mockReturnValue(variance);
			jest.spyOn(PositionService, 'getRandomX')
				.mockReturnValue(x);
			jest.spyOn(PositionService, 'getRandomY')
				.mockReturnValue(y);

			const expectedResult = {
				id,
				x,
				y,
				type,
				...typeConfig,
				...size,
			};
			const result = getTarget();

			expect(helpers.getId).toHaveBeenCalled();
			expect(helpers.getVariance).toHaveBeenCalledWith(variance);
			expect(PositionService.getRandomX)
				.toHaveBeenCalledWith(size);
			expect(PositionService.getRandomY)
				.toHaveBeenCalledWith(size);
			expect(result).toMatchObject(expectedResult);
		});
	});

	describe('swatTarget reduces health', () => {
		const decreasedTargetHealth = Symbol('decreasedTargetHealth');
		const damage = Symbol('damage');
		const mockData = { mockValue: Symbol('mockValue') };
		const state = secure({
			targets,
		});

		test('', () => {
			const data = Symbol('data');

			jest.spyOn(TargetManager, 'decreaseTargetHealth')
				.mockReturnValue(decreasedTargetHealth);
			jest.spyOn(PowerManager, 'getDamage')
				.mockReturnValue(damage);
			jest.spyOn(TargetManager, 'actuateEffect')
				.mockReturnValue(mockData);

			const result = swatTarget({ state, data });

			expect(TargetManager.decreaseTargetHealth).toHaveBeenCalledWith(
				state.targets, [data], damage
			);
			expect(PowerManager.getDamage).toHaveBeenCalledWith(state);
			expect(TargetManager.actuateEffect)
				.toHaveBeenCalledWith({ state, data });
			expect(result).toEqual({ ...mockData,
				targets: decreasedTargetHealth });
		});
	});

	describe('actuateEffect', () => {
		const { actuateEffect } = TargetManager;
		const state = {
			targets,
		};

		test('actuateEffect can handle target without effect', () => {
			const data = allTargets[random.rndValue(withoutEffect)];

			const result = actuateEffect({ state, data });

			expect(result).toEqual({});
		});

		test('actuateEffect delegates to the effect of the given target',
			() => {
				const data = allTargets[random.rndValue(withEffect)];
				const effect = Symbol('effect');

				jest.spyOn(swatEffects, data.type)
					.mockReturnValue(effect);

				const result = actuateEffect({ state, data });

				expect(result).toEqual(effect);
			});
	});

	test('getKilledTargets returns all dead targets from the given targets',
		() => {
			const deadTarget = secure({
				...target,
				health: 0,
			});
			const currentTargets = secure([
				...targets,
				deadTarget,
			]);

			const result = getKilledTargets({ state:
				{ targets: currentTargets }});

			expect(result).toEqual([deadTarget]);
		});

	test('getTargetsScore returns the bonus score',
		() => {
			const two = 2;

			const state = {
				multipliers: map(config.targets, () => 0),
			};

			const [targetOne, targetTwo] = getRandomTargets(two);

			const data = secure([
				{ ...targetOne, attackedAt: 1 },
				{ ...targetTwo, attackedAt: 1 },
				{ ...targetOne, attackedAt: 1 },
				{ ...targetOne, attackedAt: 2 },
				{ ...targetTwo, attackedAt: 3 },
			]);

			const expected = {
				// eslint-disable-next-line no-magic-numbers
				score: (6 * targetOne.score) + (2 * targetTwo.score),
				multipliers: {
					...state.multipliers,
					[targetOne.type]: 0,
					[targetTwo.type]: 1,
				},
			};

			const result = getTargetsScore({ state, data });

			expect(result).toEqual(expected);
		});

	describe('decreaseTargetHealth returns targets', () => {
		const impactedTargets = getRandomTargets();
		const [randomTarget] = impactedTargets;
		const attackedAt = Symbol('attackedAt');
		const resultingHealth = Symbol('resultingHealth');

		test('returns targets with life decreased',
			() => {
				jest.spyOn(Date, 'now')
					.mockReturnValue(attackedAt);
				jest.spyOn(TargetManager, 'isDead').mockReturnValue(false);
				jest.spyOn(Math, 'max').mockReturnValue(resultingHealth);
				const damage = 1;
				const editedTarget = {
					...randomTarget,
					health: resultingHealth,
					attackedAt: attackedAt,
				};

				const expectedTargets = replace(
					targets, randomTarget, editedTarget
				);

				const result = decreaseTargetHealth(
					targets, impactedTargets, damage
				);

				expect(Date.now).toHaveBeenCalled();
				expect(Math.max)
					.toHaveBeenCalledWith(randomTarget.health - damage, 0);
				impactedTargets.forEach((item) =>
					expect(TargetManager.isDead).toHaveBeenCalledWith(item));
				expect(result).toEqual(expectedTargets);
			});

		test('attacked a dead target', () => {
			jest.spyOn(TargetManager, 'isDead').mockReturnValue(true);
			const damage = 1;

			const result = decreaseTargetHealth(
				targets, impactedTargets, damage
			);

			expect(result).toEqual(targets);
		});
	});

	test('removeTargets remove targets to be removed', () => {
		const targetsToRemove = getRandomTargets();

		const expectedResult = targets.filter((item) =>
			!targetsToRemove.includes(item));

		const result = removeTargets({ state: { targets },
			data: targetsToRemove });

		expect(result).toEqual(expectedResult);
	});

	describe('moveTargets returns moved targets', () => {
		const state = secure({
			targets,
		});

		const position = secure({ x, y });

		test('returns the moved targets while ice is inactive', () => {
			const expectedResult = secure(targets.map((item) =>
				({ ...item, ...position })));

			jest.spyOn(PositionService, 'getRandomX')
				.mockReturnValue(x);
			jest.spyOn(PositionService, 'getRandomY')
				.mockReturnValue(y);
			jest.spyOn(PowerManager, 'isActive')
				.mockReturnValue(false);

			const result = moveTargets({ state });

			expect(PowerManager.isActive).toHaveBeenCalledWith(state, 'ice');
			expect(result).toEqual(expectedResult);
		});

		test('returns targets without changing position while ice is active',
			() => {
				const expectedResult = targets;

				jest.spyOn(PowerManager, 'isActive')
					.mockReturnValue(true);

				const result = moveTargets({ state });

				expect(PowerManager.isActive)
					.toHaveBeenCalledWith(state, 'ice');
				expect(result).toEqual(expectedResult);
			});
	});

	describe('getExpiredTargets', () => {
		const [rndtargets] = getRandomTargets();
		const livesTill = Symbol('livesTill');
		const state = { targets: [{ ...rndtargets, livesTill }] };

		const expectations = [
			['remove', 'less', false, state.targets],
			['cannot remove', 'greater', true, []],
		];

		test.each(expectations)('getExpiredTargets %p the expired target'
			+ 'when targets livesTill is %p than currentTime', (
			dummy, dummyOne, isActive, expectation
		) => {
			jest.spyOn(helpers, 'isFuture').mockReturnValue(isActive);

			const result = getExpiredTargets({ state });

			expect(helpers.isFuture)
				.toHaveBeenCalledWith(livesTill);
			expect(result).toEqual(expectation);
		});
	});

	describe('attackPlayer', () => {
		const context = {
			state: {
				targets,
			},
		};
		const decreasedHealth = Symbol('decreasedHealth');
		const [rndTarget] = getRandomTargets();
		const num = targets.reduce((acc, item) => acc + item.damage, 0);
		const expectations = [
			[num, true],
			[0, false],
		];

		test.each(expectations)('returns %p damage when isProb is %p ',
			(damage, mockValue) => {
				jest.spyOn(helpers, 'isProbable')
					.mockReturnValue(mockValue);
				jest.spyOn(helpers, 'getVariance')
					.mockReturnValue(rndTarget.variance);
				jest.spyOn(PlayerManager, 'decreaseHealth')
					.mockReturnValue(decreasedHealth);

				const result = attackPlayer(context);

				expect(PlayerManager.decreaseHealth)
					.toHaveBeenCalledWith({ ...context, data: damage });
				expect(helpers.getVariance)
					.toHaveBeenCalledWith(rndTarget.variance);
				expect(result).toEqual(decreasedHealth);
			});
	});

	describe('spawnTargets', () => {
		const targetTypes = keys(config.targets);
		const expectations = [
			['all', true, targetTypes.length],
			['no', false, 0],
		];
		const currentTarget = Symbol('target');

		test.each(expectations)('spawnTargets returns %p target'
		+ ' when isProb is %p', (
			dummy, isActive, expectedResult
		) => {
			jest.spyOn(helpers, 'isProbable').mockReturnValue(isActive);
			jest.spyOn(TargetManager, 'getTarget')
				.mockReturnValue(currentTarget);

			const result = spawnTargets();

			targetTypes.map((targetType) => {
				expect(helpers.isProbable)
					.toHaveBeenCalledWith(config
						.targets[targetType].prob.spawn);
				isActive && expect(TargetManager.getTarget)
					.toHaveBeenCalledWith({ type: targetType });
			});
			expect(result.length).toEqual(expectedResult);
		});
	});

	describe('reproduceTargets', () => {
		const targetTypes = targets.map((item) => item.type);
		const expectations = [
			['child', true, targetTypes.length],
			['no', false, 0],
		];
		const currentTarget = Symbol('target');

		test.each(expectations)('reproduceTargets returns %p target'
		+ ' when isProb is %p', (
			dummy, isActive, expectation
		) => {
			jest.spyOn(helpers, 'isProbable').mockReturnValue(isActive);
			jest.spyOn(TargetManager, 'getTarget')
				.mockReturnValue(currentTarget);

			const result = reproduceTargets(targets);

			targetTypes.map((targetType) => {
				expect(helpers.isProbable)
					.toHaveBeenCalledWith(config.targets[type]
						.prob.fertility);
				isActive && expect(TargetManager.getTarget)
					.toHaveBeenCalledWith({ type: targetType });
			});
			expect(result.length).toEqual(expectation);
		});
	});

	describe('isDead', () => {
		const generateTest = ({ isFuture, health, expectation }, action) => {
			jest.spyOn(helpers, 'isFuture')
				.mockReturnValue(isFuture);

			const currentTarget = { health: health,
				livesTill: Symbol('livesTill') };

			const result = isDead(currentTarget);

			action !== 'killed' && expect(helpers.isFuture)
				.toHaveBeenCalledWith(currentTarget.livesTill);
			expect(result).toEqual(expectation);
		};
		const combinations = {
			killed: {
				isFuture: false,
				health: 0,
				expectation: true,
			},
			expired: {
				isFuture: false,
				health: 1,
				expectation: true,
			},
			alive: {
				isFuture: true,
				health: 1,
				expectation: false,
			},
		};

		map(combinations, (params, action) =>
			test(action, () => generateTest(params, action)));
	});
});
