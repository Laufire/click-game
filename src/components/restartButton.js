import { React } from 'react';
import context from '../core/context';

const Restart = () =>
	<div
		role="restart"
		className="restart"
		onClick={ context.actions.restart }
	> RESTART </div>;

export default Restart;
