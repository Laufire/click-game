import moment from 'moment';

const adjustTime = (
	dateValue, adjustment, unit
) =>
	moment(dateValue).add(adjustment, unit)
		.valueOf();

export { adjustTime };
