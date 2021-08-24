import { Stars } from '@material-ui/icons';
import { React } from 'react';
import context from '../core/context';
import PowerManager from '../services/powerManager';
import ActivePower from './activePower';
import Container from './container';

const Score = () =>
	<div role="score" className="score">
		<Stars title="icon" className="score-icon"/>
		{ context.state.score }
		{ Container(PowerManager.getActivePowers(context),
			ActivePower) }
	</div>;

export default Score;
