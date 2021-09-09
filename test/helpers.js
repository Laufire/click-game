const replace = (
	array, target, replacement
) => {
	const clone = array.slice();

	clone[array.indexOf(target)] = replacement;

	return clone;
};

const unique = (array) => array.filter((elm, i) => i === array.indexOf(elm));

const isAcceptable = (
	actual, expected, margin
) => Math.abs((expected - actual) / (expected || 1)) <= margin;

const hundred = 100;

const retry = (fn, retryCount = hundred) => {
	const ret = [];
	let i = 0;

	while(i < retryCount)
		ret.push(fn(i++));

	return ret;
};

export { replace, unique, isAcceptable, retry };
