import { React } from 'react';
import context from '../core/context';
import '../App.scss';
import PlayerManager from '../services/playerManager';

const healthBar = () => {
	const healthRatio
		= PlayerManager.getHealthRatio(context);
	const hundred = 100;

	return <div className="health-bar" role="healthBar">
		<div
			className="indicator"
			style={ {
				width: `${ healthRatio * hundred }%`,
				backgroundColor: `${ PlayerManager.getHealthColor(healthRatio) }`,
			} }
		/>
		<span className="life-indicator">
			{context.state.health}%
		</span>
	</div>;
};

export default healthBar;
