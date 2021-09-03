import { rndString, rndBetween } from '@laufire/utils/random';
import config from '../core/config';

const hundred = 100;

const getId = () => rndString(config.idLength);

const getVariance = (variance) =>
	rndBetween(hundred - (variance * hundred),
		hundred + (variance * hundred)) / hundred;

const isFuture = (dateValue) => dateValue > Date.now();

const isProbable = (probablity) =>
	rndBetween(1, hundred) <= probablity * hundred;

export { getId,
	getVariance, isFuture, isProbable };
