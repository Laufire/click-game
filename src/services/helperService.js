import { rndString, rndBetween } from '@laufire/utils/random';
import moment from 'moment';
import config from '../core/config';

const hundred = 100;

const getId = () => rndString(config.idLength);

const getVariance = (variance) =>
	rndBetween(hundred - (variance * hundred),
		hundred + (variance * hundred)) / hundred;

const adjustTime = (
	dateValue, adjustment, unit
) =>
	moment(dateValue).add(adjustment, unit)
		.valueOf();

const isFuture = (dateValue) => dateValue > Date.now();

const isProbable = (probablity) =>
	rndBetween(1, hundred) <= probablity * hundred;

export { getId,
	getVariance, adjustTime, isFuture, isProbable };
