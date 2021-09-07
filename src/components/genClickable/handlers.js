import context from '../../core/context';

const clickHandlers = {
	target: (data) => context.actions.swatTarget(data),
	power: (data) => {
		context.actions.activatePower(data);
		context.actions.removeActivatedPower(data);
	},
};

export default clickHandlers;
