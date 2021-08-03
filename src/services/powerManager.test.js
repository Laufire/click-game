import config from '../core/config';
import PowerManager from './powerManager';

describe('PowerManager', () => {
	describe('getPower', () => {
		const { getPower } = PowerManager;
		const [type] = ['bomb'];
		const typeConfig = config.powers[type];

		test('getPower bomb power', () => {
			const power = getPower({ type });

			expect(power).toMatchObject({
				id: expect.any(String),
				x: expect.any(Number),
				y: expect.any(Number),
				...typeConfig,
			});
		});
	});
});
