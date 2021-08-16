/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
const replace = (
	array, target, replacement
) => {
	const clone = array.slice();

	clone[array.indexOf(target)] = replacement;

	return clone;
};

const unique = (array) => array.filter((elm, i) => i === array.indexOf(elm));

const adjustDate = (baseDate, adjustment) =>
	new Date(baseDate.setDate(baseDate.getDate() + adjustment));

export { replace, unique, adjustDate };
