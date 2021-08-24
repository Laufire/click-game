import { React } from 'react';
import config from '../core/config';

const ActivePower = (powerType) =>
	<img
		key={ powerType }
		className="active-power"
		role="active-power"
		src={ config.powers[powerType].image }
	/> ;

export default ActivePower;
