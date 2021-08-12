import { React } from 'react';
import config from '../core/config';
import PowerManager from '../services/powerManager';
import context from '../core/context';

const style = {
	height: 15,
	width: 15,
};

const getPower = (powerType) =>
	<img
		key={ powerType }
		role="active-power"
		style={ style }
		src={ config.powers[powerType].image }
	/> ;

const ActivePowers = () => PowerManager.getActivePowers(context).map(getPower);

export default ActivePowers;
