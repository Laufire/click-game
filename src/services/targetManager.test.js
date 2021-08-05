/* eslint-disable no-magic-numbers */
/* eslint-disable no-import-assign */
/* eslint-disable max-statements */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */
import * as random from '@laufire/utils/random';
import TargetManager from './targetManager';
import config from '../core/config';
import { secure } from '@laufire/utils/collection';
import { replace } from '../../test/helpers';
import * as position from './positionService';
import * as helper from './helperService';

beforeEach(() => {
	jest.restoreAllMocks();
});

describe('TargetManager', () => {
	const ant = secure({
		type: 'ant',
		id: '1234',
		lives: 1,
		score: 10,
	});
	const mosquito = secure({
		type: 'mosquito',
		id: '9876',
		lives: 1,
		score: 5,
	});
	const butterfly = secure({
		type: 'butterfly',
		id: '2468',
		lives: 1,
		score: 0,
	});
	const targets = secure([
		ant,
		mosquito,
		butterfly,
	]);

	describe('getTarget', () => {
		const { getTarget } = TargetManager;
		const variance = 0.5;
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
			helper.getId = jest.fn().mockImplementation(() => id);
			helper.getVariance = jest.fn().mockImplementation(() => variance);
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
			helper.getId = jest.fn().mockImplementation(() => id);
			jest.spyOn(random,
				'rndValue').mockImplementation(jest.fn(() => 'ant'));
			helper.getVariance = jest.fn().mockImplementation(() => variance);
			position.getRandomX = jest.fn().mockImplementation(() => x);
			position.getRandomY = jest.fn().mockImplementation(() => y);
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
		const state = {
			targets: targets,
			lives: 3,
		};

		test('swatTarget reduces the life of the swatted target', () => {
			const targetToSwat = random.rndValue(targets);
			const swattedTarget = {
				...targetToSwat,
				lives: targetToSwat.lives - config.swatDamage,
			};
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

	describe('getDeadTargets', () => {
		const { getDeadTargets } = TargetManager;
		const deadTarget = {
			...mosquito,
			lives: 0,
		};
		const state = [
			ant,
			deadTarget,
		];

		test('getDeadTargets returns all dead targets from the given targets',
			() => {
				const result = getDeadTargets(state);

				expect(result).toEqual([deadTarget]);
			});
	});

	describe('getTargetsScore', () => {
		const { getTargetsScore } = TargetManager;
		const state = [
			ant,
			mosquito,
		];
		const data = 15;

		test('getTargetsScore returns the total score of all given targets',
			() => {
				const result = getTargetsScore(state);

				expect(result)
					.toEqual(data);
			});
	});

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
			const clickedTarget = random.rndValue(targets);
			const result = removeTarget(targets, clickedTarget);
			const expectedResult = targets.filter((item) =>
				item !== clickedTarget);

			expect(result)
				.toEqual(expectedResult);
		});
	});
});
