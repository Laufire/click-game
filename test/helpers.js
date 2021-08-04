const replace = (
	array, target, replacement
) => {
	const clone = array.slice();

	clone[array.indexOf(target)] = replacement;

	return clone;
};

export { replace };
