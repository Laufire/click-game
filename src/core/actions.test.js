/* eslint-disable max-nested-callbacks */
import Actions from '../core/actions';
import TargetManager from '../services/targetManager';
beforeEach(() => {
	jest.restoreAllMocks();
});

describe('Actions', () => {
	describe('moveTargets', () => {
		const state = Symbol('state');
		const targets = Symbol('targets');

		test('moveTargets', () => {
			const { moveTargets } = Actions;

			jest.spyOn(TargetManager,
				'moveTargets').mockImplementation(jest.fn(() => targets));
			const result = moveTargets({ state });

			expect(TargetManager.moveTargets).toHaveBeenCalledWith(state);
			expect(result).toMatchObject({ targets });
		});
	});
});
