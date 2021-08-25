/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */

import * as random from '@laufire/utils/random';
import TargetManager from './targetManager';
import config from '../core/config';
import { keys, range, secure } from '@laufire/utils/collection';
import { replace } from '../../test/helpers';
import * as PositionService from './positionService';
import * as HelperService from './helperService';
import Mocks from '../../test/mock';
import PowerManager from './powerManager';
import PlayerManager from './playerManager';

// TODO: Remove restoreAllMocks //
beforeEach(() => {
	jest.restoreAllMocks();
});

describe('TargetManager', () => {
	const { targets, ant, mosquito, butterfly, getRandomTargets } = Mocks;
	const x = Symbol('x');
	const y = Symbol('y');
	const id = Symbol('id');

	describe('addTargets adds target', () => {
		const { addTargets } = TargetManager;

		test('returns targets with new targets added', () => {
			jest.spyOn(HelperService, 'isProbable')
				.mockImplementation(() => 1);

			const result = addTargets({ state: { targets: [] }});
			const resultKeys = result.map((item) => item.type);

			expect(resultKeys).toEqual(keys(config.targets));
		});

		test('returns the targets without any new targets', () => {
			const maxTargets = range(0, config.maxTargets).map(() => ant);
			const result = addTargets({ state: { targets: maxTargets }});

			expect(result).toEqual(maxTargets);
		});
	});

	describe('getTarget returns target', () => {
		const adjustedTime = Symbol('adjustedTime');
		const healthTill = adjustedTime;
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
				.mockImplementation(() => id);
			jest.spyOn(HelperService, 'getVariance')
				.mockImplementation(() => variance);
			jest.spyOn(HelperService, 'adjustTime')
				.mockImplementation(() => adjustedTime);
			jest.spyOn(Date, 'now').mockImplementation(() => currentTime);

			const expectedResult = {
				id,
				x,
				y,
				type,
				...typeConfig,
				...size,
				healthTill,
			};

			const result = getTarget({ x, y, type });

			expect(HelperService.getId).toHaveBeenCalled();
			expect(HelperService.getVariance).toHaveBeenCalledWith(variance);
			expect(HelperService.adjustTime).toHaveBeenCalledWith(
				currentTime, lifespan, 'seconds'
			);
			expect(result).toMatchObject(expectedResult);
		});

		test('getTarget params are optional', () => {
			jest.spyOn(HelperService,	'getId')
				.mockImplementation(() => id);
			jest.spyOn(random, 'rndValue')
				.mockImplementation(() => 'ant');
			jest.spyOn(HelperService, 'getVariance')
				.mockImplementation(() => variance);
			jest.spyOn(PositionService,	'getRandomX')
				.mockImplementation(() => x);
			jest.spyOn(PositionService,	'getRandomY')
				.mockImplementation(() => y);

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
				.mockImplementation(() => decreasedTargetLive);
			jest.spyOn(PowerManager, 'getDamage')
				.mockImplementation(() => damage);
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
					.mockImplementation(() => adjustment);
				jest.spyOn(PlayerManager, 'adjustScore')
					.mockImplementation(() => adjustedScore);

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

	test('getTargetsScore returns the total score of all given targets',
		() => {
			const { getTargetsScore } = TargetManager;
			const allTargets = secure([
				ant,
				mosquito,
			]);
			const score = ant.score + mosquito.score;

			const result = getTargetsScore({ data: allTargets });

			expect(result)
				.toEqual(score);
		});

	describe('decreaseTargetHealth returns targets', () => {
		const { decreaseTargetHealth } = TargetManager;
		const impactedTargets = getRandomTargets();
		const [randomTarget] = impactedTargets;

		test('returns targets with life decreased',
			() => {
				const damage = 1;
				const editedTarget = {
					...randomTarget,
					health: randomTarget.health - damage,
				};

				const expectedTargets = replace(
					targets, randomTarget, editedTarget
				);

				const result = decreaseTargetHealth(
					targets, impactedTargets, damage
				);

				expect(result).toEqual(expectedTargets);
			});

		test('returns non negative health', () => {
			const damage = randomTarget.health + 1;
			const editedTarget = {
				...randomTarget,
				health: 0,
			};

			const expectedTargets = replace(
				targets, randomTarget, editedTarget
			);

			const result = decreaseTargetHealth(
				targets, impactedTargets, damage
			);

			expect(result).toEqual(expectedTargets);
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
			targets: targets,
			frozenTill: new Date(),
		});

		const position = secure({ x, y });

		test('returns the moved targets while ice is inactive', () => {
			const expectedResult = secure([
				{ ...ant, ...position },
				{ ...mosquito, ...position },
				{ ...butterfly, ...position },
			]);

			jest.spyOn(PositionService, 'getRandomX')
				.mockImplementation(() => x);
			jest.spyOn(PositionService, 'getRandomY')
				.mockImplementation(() => y);
			jest.spyOn(PowerManager, 'isActive')
				.mockImplementation(() => false);

			const result = moveTargets({ state });

			expect(PowerManager.isActive).toHaveBeenCalledWith(state, 'ice');
			expect(result).toEqual(expectedResult);
		});

		test('returns targets without changing position while ice is active',
			() => {
				const expectedResult = targets;

				jest.spyOn(PowerManager, 'isActive')
					.mockImplementation(() => true);

				const result = moveTargets({ state });

				expect(PowerManager.isActive)
					.toHaveBeenCalledWith(state, 'ice');
				expect(result).toEqual(expectedResult);
			});
	});

	describe('getExpiredTargets', () => {
		const data = getRandomTargets();
		const state = { targets: data };
		const { healthTill } = data[0];

		test('getExpiredTargets remove the expired target'
			+ 'when targets healthTill is less than currentTime', () => {
			const expectedResult = data;

			jest.spyOn(HelperService, 'isFuture').mockReturnValue(false);

			const result = TargetManager.getExpiredTargets({ state });

			expect(HelperService.isFuture)
				.toHaveBeenCalledWith(healthTill);
			expect(result).toEqual(expectedResult);
		});

		test('getExpiredTargets cannot remove the expired target'
				+ 'when targets healthTill is greater than currentTime', () => {
			const expectedResult = [];

			jest.spyOn(HelperService, 'isFuture').mockReturnValue(true);

			const result = TargetManager.getExpiredTargets({ state });

			expect(HelperService.isFuture)
				.toHaveBeenCalledWith(healthTill);
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

		test('returns 0 damage when rndBetween is 0 ', () => {
			const damage = 0;

			jest.spyOn(random, 'rndBetween').mockReturnValue(0);
			jest.spyOn(PlayerManager, 'decreaseHealth')
				.mockReturnValue(decreasedHealth);

			const result = TargetManager.attackPlayer(context);

			expect(PlayerManager.decreaseHealth)
				.toHaveBeenCalledWith({ ...context, data: damage });
			expect(result).toEqual(decreasedHealth);
		});

		test('returns damage when rndBetween is 1,', () => {
			const damage = 3;

			jest.spyOn(random, 'rndBetween').mockReturnValue(1);
			jest.spyOn(PlayerManager, 'decreaseHealth')
				.mockReturnValue(decreasedHealth);

			const result = TargetManager.attackPlayer(context);

			expect(PlayerManager.decreaseHealth)
				.toHaveBeenCalledWith({ ...context, data: damage });
			expect(result).toEqual(decreasedHealth);
		});
	});
});
