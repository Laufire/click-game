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
			jest.spyOn(random, 'rndBetween')
				.mockImplementation(jest.fn(() => 1));

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

	describe('getTarget', () => {
		const { getTarget } = TargetManager;
		const type = 'ant';
		const typeConfig = config.targets[type];
		const { variance } = typeConfig;
		const { height, width } = typeConfig;
		const size = {
			height: height * variance,
			width: width * variance,
		};

		test('getTarget returns a target', () => {
			jest.spyOn(HelperService, 'getId')
				.mockImplementation(jest.fn(() => id));
			jest.spyOn(HelperService, 'getVariance')
				.mockImplementation(jest.fn(() => variance));

			const expectedResult = {
				id,
				x,
				y,
				type,
				...typeConfig,
				...size,
			};

			const result = getTarget({ x, y, type });

			expect(HelperService.getId).toHaveBeenCalled();
			expect(HelperService.getVariance).toHaveBeenCalledWith(variance);
			expect(result).toMatchObject(expectedResult);
		});

		test('getTarget params are optional', () => {
			jest.spyOn(HelperService,	'getId')
				.mockImplementation(jest.fn(() => id));
			jest.spyOn(random, 'rndValue')
				.mockImplementation(jest.fn(() => 'ant'));
			HelperService.getVariance = jest.fn().mockImplementation(() => variance);
			jest.spyOn(PositionService,	'getRandomX')
				.mockImplementation(jest.fn(() => x));
			jest.spyOn(PositionService,	'getRandomY')
				.mockImplementation(jest.fn(() => y));

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

	describe('swatTarget', () => {
		const { swatTarget } = TargetManager;
		const state = secure({
			targets: targets,
			lives: 3,
		});

		test('swatTarget reduces the life of the swatted target', () => {
			const targetToSwat = random.rndValue(targets);
			const swattedTarget = {
				...targetToSwat,
				lives: targetToSwat.lives - config.swatDamage,
			};

			const expectedTargets = replace(
				targets, targetToSwat, swattedTarget
			);

			const result = swatTarget({ state: state, data: targetToSwat });

			expect(result).toMatchObject({ targets: expectedTargets });
		});

		test('swatTarget reduces player life when a butterfly is swatted',
			() => {
				const result = swatTarget({ state: state, data: butterfly });

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
			const allTargets = secure([
				...targets,
				deadTarget,
			]);

			const result = getDeadTargets({ state:
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

	describe('decreaseTargetLives returns targets', () => {
		const { decreaseTargetLives } = TargetManager;
		const impactedTargets = getRandomTargets();
		const [randomTarget] = impactedTargets;

		test('returns targets with life decreased',
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

		test('returns non negative lives', () => {
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
		const targetsToRemove = removeTargets({ state: { targets },
			data: [targetToRetain] });

		const expectedResult = targets.filter((item) =>
		!targetsToRemove.includes(item));

		const result = removeTargets({ state: { targets },
			data: targetsToRemove });

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

			jest.spyOn(PositionService, 'getRandomX')
				.mockImplementation(jest.fn(() => x));
			jest.spyOn(PositionService, 'getRandomY')
				.mockImplementation(jest.fn(() => y));
			jest.spyOn(PowerManager, 'isFrozen')
				.mockImplementation(jest.fn(() => false));

			const result = moveTargets({ state });

			expect(PowerManager.isFrozen).toHaveBeenCalledWith(state);
			expect(result).toEqual(expectedResult);
		});

		test('returns targets without changing position while isFrozen is true',
			() => {
				jest.spyOn(PowerManager, 'isFrozen')
					.mockImplementation(jest.fn(() => true));

				const expectedResult = targets;

				const result = moveTargets({ state });

				expect(PowerManager.isFrozen).toHaveBeenCalledWith(state);
				expect(result).toEqual(expectedResult);
		});
	});
});
