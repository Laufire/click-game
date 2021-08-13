import Container from './container';

test('returns a component while parameters are passed', () => {
	const component = Symbol('component');
	const returnValue = Symbol('returnValue');
	const data = [];

	jest.spyOn(data, 'map').mockImplementation(() => returnValue);

	const result = Container(data, component);

	expect(result).toEqual(returnValue);
	expect(data.map).toHaveBeenCalledWith(component);
});
