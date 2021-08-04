/* eslint-disable max-lines-per-function */
import TargetManager from './targetManager';
import config from '../core/config';
import { contains } from '@laufire/utils/collection';

describe('TargetManager', () => {
	const ant = {
		type: 'ant',
		id: '1234',
		lives: 1,
		score: 10,
	};
	const mosquito = {
		type: 'mosquito',
		id: '9876',
		lives: 0,
		score: 5,
	};
	const butterfly = {
		type: 'butterfly',
		lives: 1,
		score: 0,
	};

	const targets = [
		ant,
		mosquito,
		butterfly,
	];

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
			const swattedAnt = { ...ant, lives: ant.lives - config.swatDamage };

			const result = swatTarget(state, ant);

			expect(result)
				.toMatchObject({ targets: [swattedAnt, mosquito, butterfly] });
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
});
