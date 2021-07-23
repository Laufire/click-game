import { React } from 'react';
import context from '../core/context';

const style = {
	marginTop: '0.5em',
	background: 'silver',
	fontSize: '30pt',
	textAlign: 'center',
};

const Restart = () =>
	<div
		style={ style }
		onClick={ context.actions.restart }
	> Restart </div>;

export default Restart;
