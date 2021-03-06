/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */

import * as random from '@laufire/utils/random';
import config from '../../core/config';
import PowerManager from '../powerManager';
import { damage } from './data';
import Powers from './powers';
import * as helper from '../helpers';
import * as collection from '@laufire/utils/collection';
import TargetManager from '../targetManager';
import Mocks from '../../../test/mock';
import { getTransientPowers } from '../../core/helpers';
import * as PositionService from '../positionService';
import { rndBetween } from '@laufire/utils/lib';

describe('PowerManager', () => {
	const two = 2;
	const { map, secure, keys, filter } = collection;
	const powers = keys(config.powers)
		.map((type) => PowerManager.getPower({ type }));

	describe('getPower', () => {
		const type = random.rndValue(keys(config.powers));
		const { getPower } = PowerManager;
		const typeConfig = config.powers[type];
		const id = Symbol('id');
		const x = Symbol('x');
		const y = Symbol('y');

		test('getPower returns random power', () => {
			const expectedResult = { id, x, y, ...typeConfig };

			jest.spyOn(helper, 'getId').mockReturnValue(id);
			jest.spyOn(PositionService, 'getRandomX').mockReturnValue(x);
			jest.spyOn(PositionService, 'getRandomY').mockReturnValue(y);

			const result = getPower({ type });

			expect(helper.getId).toHaveBeenCalled();
			expect(PositionService.getRandomX).toHaveBeenCalledWith(typeConfig);
			expect(PositionService.getRandomY).toHaveBeenCalledWith(typeConfig);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('removeExpiredPowers', () => {
		const expectations = [
			['does not removes', false, powers],
			['removes', true, []],
		];

		test.each(expectations)('%p powers while isProb is %p',
			(
				dummy, isActive, expectation
			) => {
				jest.spyOn(helper, 'isProbable')
					.mockReturnValue(isActive);

				const result = PowerManager
					.removeExpiredPowers({ state: { powers }});

				powers.map((power) => expect(helper.isProbable)
					.toHaveBeenCalledWith(power.prob.remove));
				expect(result).toEqual(expectation);
			});
	});

	test('removePower remove the given power', () => {
		const data = random.rndValue(powers);
		const expectedResult
			= powers.filter((power) => power.type !== data.type);

		const result = PowerManager
			.removePower({ state: { powers }, data: data });

		expect(result).toEqual(expectedResult);
	});

	test('activatePower activates the given power', () => {
		const returnValue = Symbol('returnValue');
		const state = Symbol('state');
		const type = random.rndValue(keys(config.powers));
		const data = { type };

		jest.spyOn(Powers, type)
			.mockReturnValue(returnValue);

		const powerHandler = Powers[type];

		const result = PowerManager.activatePower({ state, data });

		expect(powerHandler).toHaveBeenCalledWith(state);
		expect(result).toEqual(returnValue);
	});

	// TODO: Improper test.
	describe('getDamage', () => {
		const superBat = Date.now();
		const expectations = [
			['superBat', 'active', true, damage.super],
			['normalBat', 'inactive', false, damage.normal],
		];

		test.each(expectations)('getDamage returns %p when power is %p',
			(
				dummy, dummyOne, isActive, expectation
			) => {
				jest.spyOn(helper, 'isFuture')
					.mockReturnValue(isActive);

				const result = PowerManager
					.getDamage({
						duration: { superBat },
					});

				expect(helper.isFuture).toHaveBeenCalledWith(superBat);
				expect(result).toEqual(expectation);
			});
	});

	describe('getBatType', () => {
		const superBat = Date.now();
		const expectations = [
			['super', 'active', true],
			['normal', 'inactive', false],
		];

		test.each(expectations)('getBatType returns %p when superBat is %p',
			(
				type, dummy, isActive
			) => {
				jest.spyOn(helper, 'isFuture')
					.mockReturnValue(isActive);

				const result = PowerManager.getBatType({
					duration: { superBat },
				});

				expect(helper.isFuture).toHaveBeenCalledWith(superBat);
				expect(result).toEqual(type);
			});
	});

	describe('addPowers', () => {
		const context = { state: { powers: [], targets: [] }};
		const expectedPowers = [Symbol('power')];
		const expectedDropCounts = 1;
		const expectedResult = Symbol('rndValues');

		test('adds powers based on drop prob', () => {
			jest.spyOn(random, 'rndValues')
				.mockReturnValue(expectedResult);
			jest.spyOn(PowerManager, 'getPowers')
				.mockReturnValue(expectedPowers);
			jest.spyOn(PowerManager, 'getDropCount')
				.mockReturnValue(expectedDropCounts);

			const result = PowerManager.addPowers(context);

			expect(random.rndValues).toHaveBeenCalledWith([
				...context.state.powers,
				...expectedPowers,
			], expectedDropCounts,);
			expect(result).toEqual(expectedResult);
		});
	});

	// TODO: test required for false case.
	test('getDropCount returns killed targets count based on drop prob', () => {
		const rndTargets = Mocks.getRandomTargets(two);
		const context = Symbol('context');

		const targetWithDrop = { ...rndTargets[0], prob: { drop: 1 }};
		const targetWithoutDrop = { ...rndTargets[1], prob: { drop: 1 }};
		const targets = [targetWithDrop, targetWithoutDrop];

		jest.spyOn(TargetManager, 'getKilledTargets')
			.mockReturnValue(targets);
		jest.spyOn(helper, 'isProbable')
			.mockReturnValue(true);

		const result = PowerManager.getDropCount(context);

		expect(TargetManager.getKilledTargets).toHaveBeenCalledWith(context);
		targets.map((target) => expect(helper.isProbable)
			.toHaveBeenCalledWith(target.prob.drop));
		expect(result).toEqual(two);
	});

	describe('getPowers', () => {
		const expectations = [
			['powers', true, keys(config.powers).length],
			['no powers', false, 0],
		];

		test.each(expectations)('getPowers returns %p while isProb is %p',
			(
				dummy, isActive, expectation
			) => {
				const power = Symbol('power');

				jest.spyOn(helper, 'isProbable')
					.mockReturnValue(isActive);
				jest.spyOn(PowerManager, 'getPower')
					.mockReturnValue(power);

				const result = PowerManager.getPowers();

				collection.keys(config.powers).map((type) => {
					expect(helper.isProbable)
						.toHaveBeenCalledWith(config.powers[type].prob.add);
					isActive && expect(PowerManager.getPower)
						.toHaveBeenCalledWith({ type });
				});
				expect(result.length).toEqual(expectation);
			});
	});

	describe('getActivePowers', () => {
		test('getActivePowers returns a list of all active powers',
			() => {
				jest.spyOn(helper, 'isFuture')
					.mockImplementation((value) => value);

				const state = secure({
					duration: map(getTransientPowers(),
						() => Boolean(rndBetween(0, 1))),
				});
				const result = PowerManager.getActivePowers({ state });

				const expected = keys(filter(state.duration, (value) => value));

				map(state.duration,
					(value) => expect(helper.isFuture)
						.toHaveBeenCalledWith(value));
				expect(result).toEqual(expected);
			});
	});

	describe('isActive', () => {
		const returnValue = Symbol('Future');
		const power = random.rndValue(getTransientPowers());
		const [type] = keys(power);
		const state = { duration: { type }};

		test('whether isFuture is called', () => {
			jest.spyOn(helper, 'isFuture').mockReturnValue(returnValue);

			const result = PowerManager.isActive(state, power);

			expect(helper.isFuture).toHaveBeenCalledWith(state.duration[power]);
			expect(result).toEqual(returnValue);
		});
	});
});
