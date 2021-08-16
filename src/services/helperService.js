import { rndString, rndBetween } from '@laufire/utils/random';
import moment from 'moment';
import config from '../core/config';

const hundred = 100;

const getId = () => rndString(config.idLength);

const getVariance = (variance) =>
	rndBetween(hundred - (variance * hundred),
		hundred + (variance * hundred)) / hundred;

const adjustTime = (
	date, adjustment, unit
) =>
	new Date(moment(date).add(adjustment, unit));

const isFuture = (date) => date > new Date();

const isAlive = (context) => context.state.lives !== 0;

export { getId, getVariance, adjustTime, isFuture, isAlive };
