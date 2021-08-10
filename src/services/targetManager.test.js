/* eslint-disable no-magic-numbers */
/* eslint-disable no-import-assign */
/* eslint-disable max-statements */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */
import * as random from '@laufire/utils/random';
import TargetManager from './targetManager';
import config from '../core/config';
import { keys, range, secure } from '@laufire/utils/collection';
import { replace } from '../../test/helpers';
import * as position from './positionService';
import * as helper from './helperService';
import Mocks from '../../test/mock';
import PowerManager from './powerManager';

beforeEach(() => {
	jest.restoreAllMocks();
});

// TODO: remove describe, if it has only one test.

describe('TargetManager', () => {
	const { targets, ant, mosquito, butterfly } = Mocks;

	describe('addTargets', () => {
		const { addTargets } = TargetManager;

		test('addTargets add target', () => {
			jest.spyOn(random,
				'rndBetween').mockImplementation(jest.fn(() => 1));

			const result = addTargets({ targets: [] });
			const resultKeys = result.map((item) => item.type);

			expect(resultKeys).toEqual(keys(config.targets));
		});

		test('addTargets return target', () => {
			const maxTargets = range(0, config.maxTargets).map(() => ant);
			const result = addTargets({ targets: maxTargets });

			expect(result).toEqual(maxTargets);
		});
	});

	describe('getTarget', () => {
		const { getTarget } = TargetManager;
		const variance = 0.5;
		// TODO: split to individual vars.
		const [x, y, type, id] = [Symbol('x'),
			Symbol('y'),
			'ant',
			Symbol('id')];
		const typeConfig = config.targets[type];
		const { height, width } = typeConfig;
		const size = {
			height: height * variance,
			width: width * variance,
		};

		test('getTarget returns a target', () => {
			jest.spyOn(helper,
				'getId').mockImplementation(jest.fn(() => id));
			jest.spyOn(helper,
				'getVariance').mockImplementation(jest.fn(() => variance));

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
			jest.spyOn(helper,
				'getId').mockImplementation(jest.fn(() => id));
			jest.spyOn(random,
				'rndValue').mockImplementation(jest.fn(() => 'ant'));
			// TODO: change to spyOn format.
			helper.getVariance = jest.fn().mockImplementation(() => variance);
			jest.spyOn(position,
				'getRandomX').mockImplementation(jest.fn(() => x));
			jest.spyOn(position,
				'getRandomY').mockImplementation(jest.fn(() => y));
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
			expect(position.getRandomX)
				.toHaveBeenCalledWith(size);
			expect(position.getRandomY)
				.toHaveBeenCalledWith(size);
			expect(result).toMatchObject(expectedResult);
		});
	});

	describe('swatTarget', () => {
		const { swatTarget } = TargetManager;
		// TODO: Split lives
		const state = secure({
			targets: targets,
			lives: 3,
		});

		test('swatTarget reduces the life of the swatted target', () => {
			const targetToSwat = random.rndValue(targets);
			// TODO: Secure swatted target
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

	describe('getDeadTargets', () => {
		const { getDeadTargets } = TargetManager;
		const deadTarget = secure({
			...mosquito,
			lives: 0,
		});
		const state = secure([
			ant,
			deadTarget,
		]);

		test('getDeadTargets returns all dead targets from the given targets',
			() => {
				const result = getDeadTargets({ targets: state });

				expect(result).toEqual([deadTarget]);
			});
	});

	describe('getTargetsScore', () => {
		const { getTargetsScore } = TargetManager;
		const state = secure([
			ant,
			mosquito,
		]);
		const score = ant.score + mosquito.score;

		test('getTargetsScore returns the total score of all given targets',
			() => {
				const result = getTargetsScore(state);

				expect(result)
					.toEqual(score);
			});
	});
	// TODO: lives two different test.
	describe('decreaseTargetLives', () => {
		const { decreaseTargetLives } = TargetManager;
		const randomTarget = random.rndValue(targets);
		const impactedTargets = [randomTarget];
		const damage = random.rndValue(config.swatDamage,
			config.powers.superBat.swatDamage);
		const editedTarget = { ...randomTarget,
			lives: Math.max(randomTarget.lives - damage, 0) };

		const expectedTargets = replace(
			targets, randomTarget, editedTarget
		);

		test('decreaseTargetLives returns targets with life decreased',
			() => {
				const result = decreaseTargetLives(
					targets, impactedTargets, damage
				);

				expect(result).toEqual(expectedTargets);
			});
	});
	// TODO: removeTarget remove.
	describe('removeTargets', () => {
		const { removeTargets } = TargetManager;
		const targetToRetain = random.rndValue(targets);
		const targetsToRemove = removeTargets(targets, [targetToRetain]);

		test('removeTargets remove targets to be removed', () => {
			const result = removeTargets(targets, targetsToRemove);
			// eslint-disable-next-line max-nested-callbacks
			const expectedResult = targets.filter((item) =>
				!targetsToRemove.includes(item));

			expect(result)
				.toEqual(expectedResult);
		});
	});

	describe('removeTarget', () => {
		const { removeTarget } = TargetManager;

		test('removeTarget removes target to be removed', () => {
			const data = random.rndValue(targets);
			const result = removeTarget({ state: { targets }, data: data });
			const expectedResult = targets.filter((item) =>
				item !== data);

			expect(result)
				.toEqual(expectedResult);
		});
	});

	describe('moveTargets', () => {
		const { moveTargets } = TargetManager;
		const state = {
			targets: targets,
			frozenTill: new Date(),
		};

		test('moveTargets moves the targets', () => {
			const expectedResult = [{ ...ant, x: 10, y: 20 },
				{ ...mosquito, x: 10, y: 20 },
				{ ...butterfly, x: 10, y: 20 }];
			// TODO: replace number with symbol.

			jest.spyOn(position,
				'getRandomX').mockImplementation(jest.fn(() => 10));
			jest.spyOn(position,
				'getRandomY').mockImplementation(jest.fn(() => 20));
			jest.spyOn(PowerManager,
				'isFrozen').mockImplementation(jest.fn(() => false));

			const result = moveTargets(state);

			expect(PowerManager.isFrozen).toHaveBeenCalledWith(state);
			expect(result).toEqual(expectedResult);
		});

		test('moveTargets will not move targets when frozenTill is active',
			() => {
				const expectedResult = targets;

				jest.spyOn(PowerManager,
					'isFrozen').mockImplementation(jest.fn(() => true));

				const result = moveTargets(state);

				expect(PowerManager.isFrozen).toHaveBeenCalledWith(state);
				expect(result).toEqual(expectedResult);
			});
	});
});
