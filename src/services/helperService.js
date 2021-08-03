import { rndString } from '@laufire/utils/random';
import config from '../core/config';

const getId = () => rndString(config.idLength);

export { getId };
