/* eslint-disable max-lines-per-function */
import TargetManager from './targetManager';
import config from '../core/config';
import { contains, secure } from '@laufire/utils/collection';
import { rndValue } from '@laufire/utils/random';
import { replace } from '../../test/helpers';

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
		const [x, y, type] = [0, 0, 'ant'];

		test('getTarget returns a new target', () => {
			const target = getTarget({ x, y, type });
			const typeConfig = config.targets[type];

			expect(contains(target, { x, y, type, ...typeConfig }))
				.toEqual(true);
		});
	});

	describe('swatTarget', () => {
		const { swatTarget } = TargetManager;
		const state = {
			targets: targets,
			lives: 3,
		};

		test('swatTarget reduces the life of the swatted target', () => {
			const targetToSwat = rndValue(targets);
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
	describe('removeTargets', () => {
		const { removeTargets } = TargetManager;
		const ant = {
			score: 10,
		};
		const mosquito = {
			score: 5,
		};
		const state = [
			ant,
			mosquito,
		];
		const data = [
			ant,
		];

		test('removeTargets remove targets to be removed', () => {
			const result = removeTargets(state, data);

			expect(result)
				.toEqual([mosquito]);
		});
	});
	describe('removeTarget', () => {
		const { removeTarget } = TargetManager;
		const ant = {
			id: '10',
		};
		const mosquito = {
			id: '5',
		};
		const state = [
			ant,
			mosquito,
		];

		test('removeTarget remove target to be removed', () => {
			const result = removeTarget(state, ant);

			expect(result)
				.toEqual([mosquito]);
		});
	});
});
