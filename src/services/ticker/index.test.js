import Ticker from './index';
import MasterLoop from './masterLoop';
import context from '../../core/context';

describe('Ticker', () => {
	test('ticker', () => {
		jest.spyOn(MasterLoop, 'runMasterLoop')
			.mockImplementation();
		jest.spyOn(global, 'setInterval')
			.mockImplementation();

		Ticker.start();

		expect(MasterLoop.runMasterLoop)
			.toHaveBeenCalled();
		expect(global.setInterval)
			.toHaveBeenCalledWith(MasterLoop.runMasterLoop,
				context.config.tickerDelay);
	});
});
