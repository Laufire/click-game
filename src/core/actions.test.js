/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
import { map } from '@laufire/utils/collection';
import Actions from '../core/actions';
import TargetManager from '../services/targetManager';
import PowerManager from '../services/powerManager/index';
import PlayerManager from '../services/playerManager';

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
		attackPlayer: {
			mock: {
				library: PlayerManager,
				func: 'isRepellent',
			},
			impactedKey: 'lives',
		},
		swatBoard: {
			mock: {
				library: PlayerManager,
				func: 'penalize',
			},
			impactedKey: 'lives',
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
		const killedTargets = [Symbol('killedTargets')];
		const expiredTargets = [Symbol('expiredTargets')];
		const deadTargets = [
			...killedTargets,
			...expiredTargets,
		];

		jest.spyOn(TargetManager, 'getKilledTargets')
			.mockReturnValue(killedTargets);
		jest.spyOn(TargetManager, 'getExpiredTargets')
			.mockReturnValue(expiredTargets);
		jest.spyOn(TargetManager, 'removeTargets')
			.mockReturnValue(removedTargets);

		const mockContext = {
			data: [returned],
		};
		const { removeDeadTargets } = Actions;
		const result = removeDeadTargets(mockContext);

		expect(TargetManager.getKilledTargets)
			.toHaveBeenCalledWith(mockContext);
		expect(TargetManager.getExpiredTargets)
			.toHaveBeenCalledWith(mockContext);
		expect(TargetManager.removeTargets)
			.toHaveBeenCalledWith({ ...mockContext, data: deadTargets });
		expect(result).toMatchObject({ targets: removedTargets });
	});

	test('computeScore', () => {
		const killedTargets = [Symbol('killedTargets')];
		const targetsScore = Symbol('targetsScore');
		const score = Symbol('score');

		jest.spyOn(PlayerManager, 'adjustScore')
			.mockReturnValue(score);
		jest.spyOn(TargetManager, 'getKilledTargets')
			.mockReturnValue(killedTargets);
		jest.spyOn(TargetManager, 'getTargetsScore')
			.mockReturnValue(targetsScore);

		const mockContext = {
			state: {
				score,
			},
		};

		const { computeScore } = Actions;
		const result = computeScore(mockContext);

		expect(PlayerManager.adjustScore)
			.toHaveBeenCalledWith(mockContext.state, targetsScore);
		expect(TargetManager.getKilledTargets)
			.toHaveBeenCalledWith(mockContext);
		expect(TargetManager.getTargetsScore)
			.toHaveBeenCalledWith({ ...mockContext, data: killedTargets });
		expect(result).toMatchObject({ score });
	});
});
