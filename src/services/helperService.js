import { rndString, rndBetween } from '@laufire/utils/random';
import config from '../core/config';

const hundred = 100;

const getId = () => rndString(config.idLength);

const getVariance = (variance) =>
	rndBetween(hundred - (variance * hundred),
		hundred + (variance * hundred)) / hundred;

export { getId, getVariance };
