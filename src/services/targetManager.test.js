/* eslint-disable max-statements */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */
import * as random from '@laufire/utils/random';
import TargetManager from './targetManager';
import config from '../core/config';
import { keys, range, secure } from '@laufire/utils/collection';
import { replace } from '../../test/helpers';
import * as positionService from './positionService';
import * as helper from './helperService';
import Mocks from '../../test/mock';
import PowerManager from './powerManager';

beforeEach(() => {
	jest.restoreAllMocks();
});

describe('TargetManager', () => {
	const { targets, ant, mosquito, butterfly, getRandomTargets } = Mocks;
	const x = Symbol('x');
	const y = Symbol('y');
	const id = Symbol('id');

	describe('addTargets', () => {
		const { addTargets } = TargetManager;

		test('addTargets add target', () => {
			jest.spyOn(random, 'rndBetween')
				.mockImplementation(jest.fn(() => 1));

			const result = addTargets([]);
			const resultKeys = result.map((item) => item.type);

			expect(resultKeys).toEqual(keys(config.targets));
		});

		test('addTargets return target', () => {
			const maxTargets = range(0, config.maxTargets).map(() => ant);
			const result = addTargets(maxTargets);

			expect(result).toEqual(maxTargets);
		});
	});

	describe('getTarget', () => {
		const { getTarget } = TargetManager;
		const variance = 0.5;
		const type = 'ant';

		const typeConfig = config.targets[type];
		const { height, width } = typeConfig;
		const size = {
			height: height * variance,
			width: width * variance,
		};

		test('getTarget returns a target', () => {
			jest.spyOn(helper, 'getId')
				.mockImplementation(jest.fn(() => id));
			jest.spyOn(helper, 'getVariance')
				.mockImplementation(jest.fn(() => variance));

			const result = getTarget({ x, y, type });
			const expectedResult = {
				id,
				x,
				y,
				type,
				...typeConfig,
				...size,
			};

			expect(helper.getId).toHaveBeenCalled();
			expect(helper.getVariance).toHaveBeenCalledWith(variance);
			expect(result).toMatchObject(expectedResult);
		});

		test('getTarget params are optional', () => {
			jest.spyOn(helper, 'getId')
				.mockImplementation(jest.fn(() => id));
			jest.spyOn(random, 'rndValue')
				.mockImplementation(jest.fn(() => 'ant'));
			jest.spyOn(helper, 'getVariance')
				.mockImplementation(jest.fn(() => variance));
			jest.spyOn(positionService, 'getRandomX')
				.mockImplementation(jest.fn(() => x));
			jest.spyOn(positionService, 'getRandomY')
				.mockImplementation(jest.fn(() => y));
			const result = getTarget();
			const expectedResult = {
				id,
				x,
				y,
				type,
				...typeConfig,
				...size,
			};

			expect(helper.getId).toHaveBeenCalled();
			expect(helper.getVariance).toHaveBeenCalledWith(variance);
			expect(positionService.getRandomX)
				.toHaveBeenCalledWith(size);
			expect(positionService.getRandomY)
				.toHaveBeenCalledWith(size);
			expect(result).toMatchObject(expectedResult);
		});
	});

	describe('swatTarget', () => {
		const { swatTarget } = TargetManager;
		const lives = 3;
		const state = secure({
			targets,
			lives,
		});

		test('swatTarget reduces the life of the swatted target', () => {
			const targetToSwat = random.rndValue(targets);
			const swattedTarget = secure({
				...targetToSwat,
				lives: targetToSwat.lives - config.swatDamage,
			});
			const expectedTargets = replace(
				targets, targetToSwat, swattedTarget
			);

			const result = swatTarget(state, targetToSwat);

			expect(result).toMatchObject({ targets: expectedTargets });
		});

		test('swatTarget reduces player life when a butterfly is swatted',
			() => {
				const result = swatTarget(state, butterfly);

				expect(result).toMatchObject({
					lives: state.lives - config.penalDamage,
				});
			});
	});

	test('getDeadTargets returns all dead targets from the given targets',
		() => {
			const { getDeadTargets } = TargetManager;
			const deadTarget = secure({
				...mosquito,
				lives: 0,
			});
			const state = secure([
				ant,
				deadTarget,
			]);
			const result = getDeadTargets(state);

			expect(result).toEqual([deadTarget]);
		});

	test('getTargetsScore returns the total score of all given targets',
		() => {
			const { getTargetsScore } = TargetManager;
			const state = secure([
				ant,
				mosquito,
			]);
			const score = ant.score + mosquito.score;
			const result = getTargetsScore(state);

			expect(result)
				.toEqual(score);
		});

	// TODO: lives two different test.
	describe.only('decreaseTargetLives', () => {
		const { decreaseTargetLives } = TargetManager;
		const impactedTargets = getRandomTargets();
		const [randomTarget] = impactedTargets;

		test('decreaseTargetLives returns targets with life decreased',
			() => {
				const damage = 1;
				const editedTarget = {
					...randomTarget,
					lives: randomTarget.lives - damage,
				};
				const expectedTargets = replace(
					targets, randomTarget, editedTarget
				);

				const result = decreaseTargetLives(
					targets, impactedTargets, damage
				);

				expect(result).toEqual(expectedTargets);
			});

		test('decreaseTargetLives returns non negative lives', () => {
			const damage = randomTarget.lives + 1;
			const editedTarget = {
				...randomTarget,
				lives: 0,
			};
			const expectedTargets = replace(
				targets, randomTarget, editedTarget
			);
			const result = decreaseTargetLives(
				targets, impactedTargets, damage
			);

			expect(result).toEqual(expectedTargets);
		});
	});

	test('removeTargets remove targets to be removed', () => {
		const { removeTargets } = TargetManager;
		const targetToRetain = random.rndValue(targets);
		const targetsToRemove = removeTargets(targets, [targetToRetain]);
		const result = removeTargets(targets, targetsToRemove);
		const expectedResult = targets.filter((item) =>
			!targetsToRemove.includes(item));

		expect(result)
			.toEqual(expectedResult);
	});

	describe('moveTargets', () => {
		const { moveTargets } = TargetManager;
		const state = secure({
			targets: targets,
			frozenTill: new Date(),
		});

		const position = secure({ x, y });

		test('moveTargets moves the targets', () => {
			const expectedResult = secure([
				{ ...ant, ...position },
				{ ...mosquito, ...position },
				{ ...butterfly, ...position },
			]);

			jest.spyOn(positionService, 'getRandomX')
				.mockImplementation(jest.fn(() => x));
			jest.spyOn(positionService, 'getRandomY')
				.mockImplementation(jest.fn(() => y));
			jest.spyOn(PowerManager, 'isFrozen')
				.mockImplementation(jest.fn(() => false));

			const result = moveTargets(state);

			expect(PowerManager.isFrozen).toHaveBeenCalledWith(state);
			expect(result).toEqual(expectedResult);
		});

		test('moveTargets will not move targets when frozenTill is active',
			() => {
				const expectedResult = targets;

				jest.spyOn(PowerManager, 'isFrozen')
					.mockImplementation(jest.fn(() => true));

				const result = moveTargets(state);

				expect(PowerManager.isFrozen).toHaveBeenCalledWith(state);
				expect(result).toEqual(expectedResult);
			});
	});
});
