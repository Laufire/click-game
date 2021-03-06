/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import { map } from '@laufire/utils/collection';
import Actions from '../core/actions';
import TargetManager from '../services/targetManager';
import PowerManager from '../services/powerManager/index';
import PlayerManager from '../services/playerManager';

describe('actions', () => {
	const returned = Symbol('returned');

	describe('proxies', () => {
		const context = Symbol('context');
		const testProxy = ({ mock, impactedKey, action }) => {
			const { library, func } = mock;

			jest.spyOn(library,	func)
				.mockReturnValue(returned);

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
					func: 'getAttacked',
				},
				impactedKey: 'health',
			},
			swatBoard: {
				mock: {
					library: PlayerManager,
					func: 'penalize',
				},
				impactedKey: 'health',
			},
		};

		map(proxies, (params, action) =>
			test(action, () => testProxy({ ...params, action })));
	});

	test('seed returns seed', () => {
		const seed = Symbol('seed');
		const { restart } = Actions;
		const result = restart({ seed });

		expect(result).toEqual(seed);
	});

	test('removeTarget', () => {
		jest.spyOn(TargetManager, 'removeTargets')
			.mockReturnValue(returned);

		const context = {
			data: Symbol('data'),
		};

		const { removeTarget } = Actions;
		const result = removeTarget(context);

		expect(TargetManager.removeTargets)
			.toHaveBeenCalledWith({ ...context, data: [context.data] });
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

		const context = {
			data: [returned],
		};
		const { removeDeadTargets } = Actions;
		const result = removeDeadTargets(context);

		expect(TargetManager.getKilledTargets)
			.toHaveBeenCalledWith(context);
		expect(TargetManager.getExpiredTargets)
			.toHaveBeenCalledWith(context);
		expect(TargetManager.removeTargets)
			.toHaveBeenCalledWith({ ...context, data: deadTargets });
		expect(result).toMatchObject({ targets: removedTargets });
	});

	test('computeScore', () => {
		const killedTargets = [Symbol('killedTargets')];
		const score = Symbol('score');
		const multipliers = Symbol('multipliers');
		const targetsScore = { score,	multipliers };

		jest.spyOn(PlayerManager, 'adjustScore')
			.mockReturnValue(score);
		jest.spyOn(TargetManager, 'getKilledTargets')
			.mockReturnValue(killedTargets);
		jest.spyOn(TargetManager, 'getTargetsScore')
			.mockReturnValue(targetsScore);

		const context = {
			state: {
				score,
			},
		};

		const { computeScore } = Actions;
		const result = computeScore(context);

		expect(PlayerManager.adjustScore)
			.toHaveBeenCalledWith(context.state, score);
		expect(TargetManager.getKilledTargets)
			.toHaveBeenCalledWith(context);
		expect(TargetManager.getTargetsScore)
			.toHaveBeenCalledWith({ ...context, data: killedTargets });
		expect(result)
			.toMatchObject({ score, multipliers });
	});
});
