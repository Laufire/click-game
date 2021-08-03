/* eslint-disable max-lines-per-function */
import TargetManager from './targetManager';
import config from '../core/config';
import { contains, merge } from '@laufire/utils/collection';

describe('TargetManager', () => {
	describe('getTarget', () => {
		const { getTarget } = TargetManager;
		const [x, y, type] = [0, 0, 'ant'];

		test('getTarget returns a target', () => {
			const target = getTarget({ x, y, type });
			const typeConfig = config.targets[type];

			expect(contains(target, { x, y, type, ...typeConfig }))
				.toEqual(true);
		});
	});
	describe('swatTarget', () => {
		const { swatTarget } = TargetManager;
		const ant = {
			type: 'ant',
			id: '1234',
			lives: 1,
		};
		const mosquito = {
			type: 'mosquito',
			id: '9876',
			lives: 0,
		};
		const butterfly = {
			type: 'butterfly',
			lives: 1,
		};
		const state = {
			targets: [
				ant,
				mosquito,
				butterfly,
			],
			lives: 3,
		};

		test('swatTarget returns target lives', () => {
			const swattedAnt = { ...ant, lives: ant.lives - config.swatDamage };

			const result = swatTarget(state, ant);

			expect(result)
				.toMatchObject({ targets: [swattedAnt, mosquito, butterfly] });
		});

		test('swatTarget returns lives', () => {
			const swattedButterfly = { ...butterfly,
				lives: butterfly.lives - config.swatDamage };

			const result = swatTarget(state, butterfly);

			expect(result).toMatchObject({ lives: state.lives - 1,
				targets: [ant, mosquito, swattedButterfly] });
		});
	});
	describe('getDeadTargets', () => {
		const { getDeadTargets } = TargetManager;
		const ant = {
			lives: 1,
		};
		const mosquito = {
			lives: 0,
		};
		const state = [
			ant,
			mosquito,
		];

		test('addTarget returns a target', () => {
			const result = getDeadTargets(state);

			expect(result)
				.toEqual([mosquito]);
		});
	});
	describe('getTargetsScore', () => {
		const { getTargetsScore } = TargetManager;
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
		const data = 15;

		test('addTarget returns a total score', () => {
			const result = getTargetsScore(state);

			expect(result)
				.toEqual(data);
		});
	});
});
