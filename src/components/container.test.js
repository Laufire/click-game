import Container from './container';

test('returns a component while parameters are passed', () => {
	const component = Symbol('component');
	const returnValue = Symbol('returnValue');
	const data = [];

	jest.spyOn(data, 'map').mockReturnValue(returnValue);

	const result = Container(data, component);

	expect(data.map).toHaveBeenCalledWith(component);
	expect(result).toEqual(returnValue);
});
