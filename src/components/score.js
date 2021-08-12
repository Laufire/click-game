import { Stars } from '@material-ui/icons';
import { React } from 'react';
import context from '../core/context';
import ActivePowers from './activePowers';

const Score = () =>
	<div
		className="score"
		role="score"
	>
		<Stars className="score-icon"/>
		{ context.state.score }
		{ ActivePowers() }
	</div>;

export default Score;
