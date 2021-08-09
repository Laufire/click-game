import { React } from 'react';
import context from '../core/context';
import { isFuture } from '../services/helperService';

const style = {
	height: 15,
	width: 15,
};

const getPower = (power) =>
	isFuture(power.powerType)
	&& <img style={ style } src={ power.image }/> ;

const ActivePowers = () => {
	const getPowers = [
		{
			powerType: context.state.frozenTill,
			image: context.config.powers.ice.image,
		},
		{
			powerType: context.state.superTill,
			image: context.config.powers.superBat.image,
		},
	];
	const powers = getPowers.map(getPower);

	return powers;
};

export default ActivePowers;
