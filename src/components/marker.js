import { React } from 'react';

const size = 10;
const two = 2;

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	height: `${ size }px`,
	width: `${ size }px`,
	marginTop: `${ -size / two }px`,
	marginLeft: `${ -size / two }px`,
	background: 'red',
};

const Marker = () => <div style={ style }/>;

export default Marker;
