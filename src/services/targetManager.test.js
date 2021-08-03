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
});
