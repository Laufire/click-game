import { merge } from '@laufire/utils/collection';
import { getURLParam } from '../../services/urlService';

const base = {
	tickerDelay: 10000,
};
const dev = merge(base, JSON.parse(getURLParam('config')));

export default dev;
