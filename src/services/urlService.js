const defaults = {
	env: 'prod',
	config: '{}',
};

const getURLParam = (param) =>
	// eslint-disable-next-line no-undef
	new URLSearchParams(window.location.search).get(param) || defaults[param];

export { getURLParam };
