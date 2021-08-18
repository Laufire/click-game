/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
import { map } from '@laufire/utils/collection';
import Actions from '../core/actions';
import TargetManager from '../services/targetManager';
import PowerManager from '../services/powerManager/index';
import PlayerManager from '../services/playerManager';

beforeEach(() => {
	jest.restoreAllMocks();
});

describe('Proxies', () => {
	const context = Symbol('context');
	const returned = Symbol('returned');
	const testProxy = ({ mock, impactedKey, action }) => {
		const { library, func } = mock;

		jest.spyOn(library,	func).mockImplementation(jest.fn(() => returned));

		const result = Actions[action](context);

		expect(library[func]).toHaveBeenCalledWith(context);
		impactedKey
			? expect(result).toMatchObject({ [impactedKey]: returned })
			: expect(result).toEqual(returned);
	};

	const proxies = {
		moveTargets: {
			mock: {
				library: TargetManager,
				func: 'moveTargets',
			},
			impactedKey: 'targets',
		},
		addTargets: {
			mock: {
				library: TargetManager,
				func: 'addTargets',
			},
			impactedKey: 'targets',
		},
		removeExpiredPowers: {
			mock: {
				library: PowerManager,
				func: 'removeExpiredPowers',
			},
			impactedKey: 'powers',
		},
		removeActivatedPower: {
			mock: {
				library: PowerManager,
				func: 'removePower',
			},
			impactedKey: 'powers',
		},
		addPowers: {
			mock: {
				library: PowerManager,
				func: 'addPowers',
			},
			impactedKey: 'powers',
		},
		decreaseLives: {
			mock: {
				library: PlayerManager,
				func: 'decreaseLives',
			},
			impactedKey: 'lives',
		},
		activatePower: {
			mock: {
				library: PowerManager,
				func: 'activatePower',
			},
		},
		swatTarget: {
			mock: {
				library: TargetManager,
				func: 'swatTarget',
			},
		},
	};

	map(proxies, (params, action) =>
		test(action, () => testProxy({ ...params, action })));

	test('seed returns seed', () => {
		const seed = Symbol('seed');
		const { restart } = Actions;
		const result = restart({ seed });

		expect(result).toEqual(seed);
	});

	test('removeTarget', () => {
		jest.spyOn(TargetManager, 'removeTargets')
			.mockImplementation(jest.fn(() => returned));

		const mockContext = {
			data: Symbol('data'),
		};

		const { removeTarget } = Actions;
		const result = removeTarget(mockContext);

		expect(TargetManager.removeTargets)
			.toHaveBeenCalledWith({ ...mockContext, data: [mockContext.data] });
		expect(result).toMatchObject({ targets: returned });
	});

	test('removeDeadTargets', () => {
		const removedTargets = [Symbol('removedTargets')];
		const impactedTargets = [Symbol('impactedTargets')];

		jest.spyOn(TargetManager, 'getKilledTargets')
			.mockImplementation(jest.fn(() => impactedTargets));
		jest.spyOn(TargetManager, 'removeTargets')
			.mockImplementation(jest.fn(() => removedTargets));
		jest.spyOn(TargetManager, 'getTargetsScore')
			.mockImplementation(jest.fn(() => 1));

		const mockContext = {
			data: [returned],
			state: {
				score: 1,
			},
		};
		const { removeDeadTargets } = Actions;
		const result = removeDeadTargets(mockContext);

		expect(TargetManager.getKilledTargets)
			.toHaveBeenCalledWith(mockContext);
		expect(TargetManager.removeTargets)
			.toHaveBeenCalledWith({ ...mockContext, data: impactedTargets });
		expect(TargetManager.getTargetsScore)
			.toHaveBeenCalledWith({ ...mockContext, data: impactedTargets });
		expect(result).toMatchObject({ targets: removedTargets, score: 2 });
	});
});
