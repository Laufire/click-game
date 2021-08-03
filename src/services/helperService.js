import { rndString } from '@laufire/utils/random';
import config from '../core/config';

const getRndString = () => rndString(config.idLength);

export { getRndString };
