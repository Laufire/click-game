import config from '../core/config';
import PowerManager from './powerManager';

// eslint-disable-next-line max-lines-per-function
describe('PowerManager', () => {
	describe('getPower', () => {
		const { getPower } = PowerManager;
		const [type] = ['bomb'];
		const typeConfig = config.powers[type];
		const length = config.idLength;

		test('getPower bomb power', () => {
			const power = getPower({ type });

			expect(power).toMatchObject({
				id: expect.any(String),
				x: expect.any(Number),
				y: expect.any(Number),
				...typeConfig,
			});
			expect(power.id.length).toEqual(length);
		});
	});
	// eslint-disable-next-line max-lines-per-function
	describe.skip('removePowers', () => {
		const { removePowers } = PowerManager;
		const bomb = {
			id: 'abcd',
			type: 'bomb',
			prob: 1,
		};
		const ice = {
			id: 'efgh',
			type: 'ice',
			prob: 0,
		};
		const state = {
			powers: [
				bomb,
				ice,
			],
		};

		test('removePowers bomb ice', () => {
			const result = removePowers(state);

			expect(result).toMatchObject({ powers: [ice] });
			expect(result).toMatchObject({ powers: [bomb] });
		});
	});
});
