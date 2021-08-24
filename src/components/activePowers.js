import { React } from 'react';
import config from '../core/config';
import PowerManager from '../services/powerManager';
import context from '../core/context';

const activePower = (powerType) =>
	<img
		key={ powerType }
		className="active-power"
		role="active-power"
		src={ config.powers[powerType].image }
	/> ;

const ActivePowers = () =>
	PowerManager.getActivePowers(context).map(activePower);

export default ActivePowers;
