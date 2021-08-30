const sixty = 60;
const twentyFour = 24;
const seconds = 1000;
const minutes = sixty * seconds;
const hours = sixty * minutes;
const days = twentyFour * hours;

const msTable = {
	days,
	hours,
	minutes,
	seconds,
};

const adjustTime = (
	dateValue, adjustment, unit
) =>
	dateValue + (adjustment * msTable[unit]);

export { adjustTime };
