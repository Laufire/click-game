/* eslint-disable max-lines-per-function */
import TargetManager from './targetManager';
import config from '../core/config';
import { contains } from '@laufire/utils/collection';

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
		const [state, data] = [{ lives: config.lives }, { type: 'butterfly' }];

		test('swatTarget returns lives', () => {
			const result = swatTarget(state, data);
			const lives = config.lives - 1;

			expect(contains(result, { lives }))
				.toEqual(true);
		});
	});
});
