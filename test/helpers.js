const replace = (
	array, target, replacement
) => {
	const clone = array.slice();

	clone[array.indexOf(target)] = replacement;

	return clone;
};

const unique = (array) => array.filter((elm, i) => i === array.indexOf(elm));

export { replace, unique };
