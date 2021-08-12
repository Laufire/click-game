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
		style={ style }
		role="active-power"
		src={ config.powers[powerType].image }
	/> ;

const ActivePowers = () => {
	const powers = PowerManager.getActivePowers(context).map(getPower);

	return powers;
};

export default ActivePowers;
