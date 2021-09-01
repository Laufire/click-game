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
import * as HelperService from '../helperService';
import Mocks from '../../../test/mock';
import PowerManager from '../powerManager';
import PlayerManager from '../playerManager';
import * as timeService from '../timeService';

describe('TargetManager', () => {
	const { targets, ant, mosquito, butterfly, getRandomTargets } = Mocks;
	const x = Symbol('x');
	const y = Symbol('y');
	const id = Symbol('id');

	describe('addTargets adds target', () => {
		const { addTargets } = TargetManager;

		test('returns targets with new targets added', () => {
			const spawnTargets = [Symbol('spawnTargets')];
			const reproduceTargets = [Symbol('reproduceTargets')];

			jest.spyOn(HelperService, 'isProbable')
				.mockReturnValue(1);
			jest.spyOn(TargetManager, 'spawnTargets')
				.mockReturnValue(spawnTargets);
			jest.spyOn(TargetManager, 'reproduceTargets')
				.mockReturnValue(reproduceTargets);

			const result = addTargets({ state: { targets }});
			const expectedResult = [
				...targets,
				...spawnTargets,
				...reproduceTargets,
			];

			expect(TargetManager.spawnTargets).toHaveBeenCalledWith();
			expect(TargetManager.reproduceTargets)
				.toHaveBeenCalledWith(targets);
			expect(result).toEqual(expectedResult);
		});

		test('returns the targets without any new targets', () => {
			const maxTargets = range(0, config.maxTargets).map(() => ant);
			const result = addTargets({ state: { targets: maxTargets }});

			expect(result).toEqual(maxTargets);
		});
	});

	describe('getTarget returns target', () => {
		const adjustedTime = Symbol('adjustedTime');
		const livesTill = adjustedTime;
		const currentTime = Symbol('currentTime');
		const { getTarget } = TargetManager;
		const type = 'ant';
		const typeConfig = config.targets[type];
		const { variance } = typeConfig;
		const { height, width } = typeConfig;
		const lifespan = typeConfig.lifespan * variance;
		const size = {
			height: height * variance,
			width: width * variance,
		};

		test('returns a target while params are passed', () => {
			jest.spyOn(HelperService, 'getId')
				.mockReturnValue(id);
			jest.spyOn(HelperService, 'getVariance')
				.mockReturnValue(variance);
			jest.spyOn(timeService, 'adjustTime')
				.mockReturnValue(adjustedTime);
			jest.spyOn(Date, 'now').mockReturnValue(currentTime);

			const expectedResult = {
				id,
				x,
				y,
				type,
				...typeConfig,
				...size,
				livesTill,
			};

			const result = getTarget({ x, y, type });

			expect(HelperService.getId).toHaveBeenCalled();
			expect(HelperService.getVariance).toHaveBeenCalledWith(variance);
			expect(timeService.adjustTime).toHaveBeenCalledWith(
				currentTime, lifespan, 'seconds'
			);
			expect(result).toMatchObject(expectedResult);
		});

		test('getTarget params are optional', () => {
			jest.spyOn(HelperService,	'getId')
				.mockReturnValue(id);
			jest.spyOn(random, 'rndValue')
				.mockReturnValue('ant');
			jest.spyOn(HelperService, 'getVariance')
				.mockReturnValue(variance);
			jest.spyOn(PositionService,	'getRandomX')
				.mockReturnValue(x);
			jest.spyOn(PositionService,	'getRandomY')
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

			expect(HelperService.getId).toHaveBeenCalled();
			expect(HelperService.getVariance).toHaveBeenCalledWith(variance);
			expect(PositionService.getRandomX)
				.toHaveBeenCalledWith(size);
			expect(PositionService.getRandomY)
				.toHaveBeenCalledWith(size);
			expect(result).toMatchObject(expectedResult);
		});
	});

	describe('swatTarget reduces life', () => {
		const { swatTarget } = TargetManager;
		const health = 3;
		const score = 10;
		const spoiler = TargetManager.getTarget({ type: 'spoiler' });
		const decreasedTargetLive = Symbol('decreasedTargetLive');
		const damage = Symbol('damage');
		const state = secure({
			targets,
			health,
			score,
		});

		const spyOn = () => {
			jest.spyOn(TargetManager, 'decreaseTargetHealth')
				.mockReturnValue(decreasedTargetLive);
			jest.spyOn(PowerManager, 'getDamage')
				.mockReturnValue(damage);
		};

		test('returns reduced life of the swatted target', () => {
			spyOn();

			const targetToSwat = random.rndValue(targets);

			const result = swatTarget({ state: state, data: targetToSwat });

			expect(result).toMatchObject({ targets: decreasedTargetLive });
			expect(TargetManager.decreaseTargetHealth)
				.toHaveBeenCalledWith(
					state.targets, [targetToSwat], damage
				);
			expect(PowerManager.getDamage)
				.toHaveBeenCalledWith(state);
		});

		test('returns reduced player life when a butterfly is swatted',
			() => {
				spyOn();

				const targetToSwat = TargetManager
					.getTarget({ type: 'butterfly' });

				const result = swatTarget({ state: state, data: targetToSwat });

				expect(result).toMatchObject({
					health: state.health - config.penalDamage,
				});
			});

		test('returns reduced player score when a spoiler is swatted',
			() => {
				const adjustedScore = Symbol('adjustment');
				const adjustment = 5;

				spyOn();
				jest.spyOn(random, 'rndBetween')
					.mockReturnValue(adjustment);
				jest.spyOn(PlayerManager, 'adjustScore')
					.mockReturnValue(adjustedScore);

				const { min, max } = config.targets.spoiler.effect.score;

				const result = swatTarget({ state: state, data: spoiler });

				expect(random.rndBetween)
					.toHaveBeenCalledWith(min, max);
				expect(PlayerManager.adjustScore)
					.toHaveBeenCalledWith(state, -adjustment);
				expect(result).toMatchObject({
					score: adjustedScore,
				});
			});
	});

	test('getKilledTargets returns all dead targets from the given targets',
		() => {
			const { getKilledTargets } = TargetManager;
			const deadTarget = secure({
				...mosquito,
				health: 0,
			});
			const allTargets = secure([
				...targets,
				deadTarget,
			]);

			const result = getKilledTargets({ state:
				{ targets: allTargets }});

			expect(result).toEqual([deadTarget]);
		});

	test('getTargetsScore returns the bonus score',
		() => {
			const two = 2;
			const { getTargetsScore } = TargetManager;
			const [targetOne, targetTwo] = getRandomTargets(two);

			const allTargets = secure([
				{ ...targetOne, attackedAt: 1, score: 5 },
				{ ...targetOne, attackedAt: 1, score: 5 },
				{ ...targetTwo, attackedAt: 3, score: 1 },
				{ ...targetOne, attackedAt: 4, score: 5 },
			]);
			const expected = 21;

			const result = getTargetsScore({ data: allTargets });

			expect(result)
				.toEqual(expected);
		});

	describe('decreaseTargetHealth returns targets', () => {
		const { decreaseTargetHealth } = TargetManager;
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
				impactedTargets.forEach((target) =>
					expect(TargetManager.isDead).toHaveBeenCalledWith(target));
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
		const { removeTargets } = TargetManager;
		const targetToRetain = random.rndValue(targets);
		const targetsToRemove = removeTargets({ state: { targets },
			data: [targetToRetain] });

		const expectedResult = targets.filter((item) =>
			!targetsToRemove.includes(item));

		const result = removeTargets({ state: { targets },
			data: targetsToRemove });

		expect(result)
			.toEqual(expectedResult);
	});

	describe('moveTargets returns moved targets', () => {
		const { moveTargets } = TargetManager;
		const state = secure({
			targets,
		});

		const position = secure({ x, y });

		test('returns the moved targets while ice is inactive', () => {
			const expectedResult = secure([
				{ ...ant, ...position },
				{ ...mosquito, ...position },
				{ ...butterfly, ...position },
			]);

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
		const data = getRandomTargets();
		const state = { targets: data };
		const { livesTill } = data[0];

		test('getExpiredTargets remove the expired target'
			+ 'when targets livesTill is less than currentTime', () => {
			const expectedResult = data;

			jest.spyOn(HelperService, 'isFuture').mockReturnValue(false);

			const result = TargetManager.getExpiredTargets({ state });

			expect(HelperService.isFuture)
				.toHaveBeenCalledWith(livesTill);
			expect(result).toEqual(expectedResult);
		});

		test('getExpiredTargets cannot remove the expired target'
				+ 'when targets livesTill is greater than currentTime', () => {
			const expectedResult = [];

			jest.spyOn(HelperService, 'isFuture').mockReturnValue(true);

			const result = TargetManager.getExpiredTargets({ state });

			expect(HelperService.isFuture)
				.toHaveBeenCalledWith(livesTill);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('attackPlayer', () => {
		const context = {
			state: {
				targets,
			},
		};
		const decreasedHealth = Symbol('decreasedHealth');
		const target = ant;

		test('returns 0 damage when rndBetween is 0 ', () => {
			const damage = 0;

			jest.spyOn(HelperService, 'isProbable').mockReturnValue(0);
			jest.spyOn(HelperService, 'getVariance')
				.mockReturnValue(target.variance);
			jest.spyOn(PlayerManager, 'decreaseHealth')
				.mockReturnValue(decreasedHealth);

			const result = TargetManager.attackPlayer(context);

			expect(PlayerManager.decreaseHealth)
				.toHaveBeenCalledWith({ ...context, data: damage });
			expect(HelperService.getVariance)
				.toHaveBeenCalledWith(target.variance);
			expect(result).toEqual(decreasedHealth);
		});

		test('returns damage when rndBetween is 1,', () => {
			const damage = 3;

			jest.spyOn(random, 'rndBetween').mockReturnValue(1);
			jest.spyOn(HelperService, 'getVariance')
				.mockReturnValue(target.variance);
			jest.spyOn(PlayerManager, 'decreaseHealth')
				.mockReturnValue(decreasedHealth);

			const result = TargetManager.attackPlayer(context);

			expect(PlayerManager.decreaseHealth)
				.toHaveBeenCalledWith({ ...context, data: damage });
			expect(HelperService.getVariance)
				.toHaveBeenCalledWith(target.variance);
			expect(result).toEqual(decreasedHealth);
		});
	});

	describe('spawnTargets', () => {
		const { spawnTargets } = TargetManager;
		const targetTypes = keys(config.targets);

		test('spawnTargets returns all target when isProb is true', () => {
			jest.spyOn(HelperService, 'isProbable').mockReturnValue(true);

			const result = spawnTargets();
			const resultType = result.map((item) => item.type);

			targetTypes.map((type) =>
				expect(HelperService.isProbable)
					.toHaveBeenCalledWith(config.targets[type].prob.spawn));
			expect(resultType).toEqual(targetTypes);
		});

		test('spawnTargets returns no target when isProb is false', () => {
			jest.spyOn(HelperService, 'isProbable').mockReturnValue(false);

			const result = spawnTargets();

			targetTypes.map((type) =>
				expect(HelperService.isProbable)
					.toHaveBeenCalledWith(config.targets[type].prob.spawn));
			expect(result).toEqual([]);
		});
	});
	describe('reproduceTargets', () => {
		const { reproduceTargets } = TargetManager;
		const targetTypes = targets.map((target) => target.type);

		test('reproduceTargets returns child target when isProb is true',
			() => {
				jest.spyOn(HelperService, 'isProbable').mockReturnValue(true);

				const result = reproduceTargets(targets);
				const resultType = result.map((item) => item.type);

				targetTypes.map((type) =>
					expect(HelperService.isProbable)
						.toHaveBeenCalledWith(config.targets[type]
							.prob.fertility));
				expect(resultType).toEqual(targetTypes);
			});

		test('reproduceTargets returns no target when isProb is false', () => {
			jest.spyOn(HelperService, 'isProbable').mockReturnValue(false);

			const result = reproduceTargets(targets);

			targetTypes.map((type) =>
				expect(HelperService.isProbable)
					.toHaveBeenCalledWith(config.targets[type].prob.spawn));
			expect(result).toEqual([]);
		});
	});

	describe('isDead', () => {
		const generateTest = ({ isFuture, health, expectation }, action) => {
			jest.spyOn(HelperService, 'isFuture')
				.mockReturnValue(isFuture);

			const target = { health: health, livesTill: Symbol('livesTill') };
			const { isDead } = TargetManager;

			const result = isDead(target);

			action !== 'killed' && expect(HelperService.isFuture)
				.toHaveBeenCalledWith(target.livesTill);
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
