import { rndString, rndBetween } from '@laufire/utils/random';
import config from '../core/config';

const hundred = 100;
const two = 2;

const getId = () => rndString(config.idLength);

const getVariance = (variance) =>
	rndBetween(hundred - (variance * hundred),
		hundred + (variance * hundred)) / hundred;

const isFuture = (dateValue) => dateValue > Date.now();

const isProbable = (probablity) =>
	rndBetween(1, hundred) <= probablity * hundred;

const termial = (n) => n * (n + 1) / two;

const index = (data, property) => {
	const result = {};

	data.forEach((value) => (result[value[property]] = [
		...result[value[property]] || [],
		value,
	]));
	return result;
};

export { getId, getVariance, isFuture, isProbable, termial, index };
