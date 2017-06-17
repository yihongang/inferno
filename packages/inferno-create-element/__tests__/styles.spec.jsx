import { render } from 'inferno';

function styleNode(style) {
	return <div style={ style }></div>;
}

describe('CSS style properties (JSX)', () => {

	let container;

	beforeEach(function () {
		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(function () {
		render(null, container);
		container.innerHTML = '';
		document.body.removeChild(container);
	});

	it('should set and remove dynamic styles', () => {

		const styles = { display: 'none', fontFamily: 'Arial', lineHeight: 2 };

		render(<div style={ styles }/>, container);
		expect(container.firstChild.style.fontFamily).toEqual('Arial');
		expect(container.firstChild.style.lineHeight).toEqual('2');

		render(<div />, container);
		expect(container.firstChild.style.fontFamily).toEqual('');
		expect(container.firstChild.style.lineHeight).toEqual('');

	});

	it('should update styles if initially null', () => {

		let styles = null;
		render(<div style={ styles }/>, container);

		styles = { display: 'block' };

		render(<div style={ styles }/>, container);
		expect(container.firstChild.style.display).toEqual('block');
	});

	it('should update styles if updated to null multiple times', () => {
		let styles = null;

		render(<div style={ undefined }/>, container);

		render(<div style={ styles }/>, container);
		expect(container.firstChild.style.display).toEqual('');

		styles = { display: 'block' };

		render(<div style={ styles }/>, container);
		expect(container.firstChild.style.display).toEqual('block');

		render(<div style={ null }/>, container);
		expect(container.firstChild.style.display).toEqual('');

		render(<div style={ styles }/>, container);
		expect(container.firstChild.style.display).toEqual('block');

		render(<div style={ null }/>, container);
		expect(container.firstChild.style.display).toEqual('');
	});

	it('should update styles when `style` changes from null to object', () => {
		const styles = { color: 'red' };
		render(<div style={ 123 }/>, container);
		render(<div style={ styles }/>, container);
		render(<div />, container);
		render(<div style={ styles }/>, container);

		const stubStyle = container.firstChild.style;
		expect(stubStyle.color).toEqual('red');
	});

	it('should support different unit types - em and mm', () => {
		const styles = { height: '200em', width: '20mm' };
		render(<div style={ styles }/>, container);
		render(<div />, container);
		render(<div style={ styles }/>, container);

		const stubStyle = container.firstChild.style;
		expect(stubStyle.height).toEqual('200em');
		expect(stubStyle.width).toEqual('20mm');
	});

	it('should clear all the styles when removing `style`', () => {
		const styles = { display: 'none', color: 'red' };
		render(<div style={ styles }/>, container);

		const stubStyle = container.firstChild.style;
		expect(stubStyle.display).toEqual('none');
		expect(stubStyle.color).toEqual('red');
	});

	it('Should change styles', () => {
		const stylesOne = { color: 'red' };
		render(styleNode(stylesOne), container);
		expect(container.firstChild.style.color).toEqual('red');

		const styles = { color: 'blue' };
		render(styleNode(styles), container);
		expect(container.firstChild.style.color).toEqual('blue');

		const stylesTwo = { color: 'orange' };
		render(styleNode(stylesTwo), container);
		expect(container.firstChild.style.color).toEqual('orange');

		const stylesThree = { color: 'orange' };
		render(styleNode(stylesThree), container);
		expect(container.firstChild.style.color).toEqual('orange');
	});

	it('Should remove style attribute when next value is null', () => {
		const stylesOne = { float: 'left' };
		render(styleNode(stylesOne), container);
		expect(container.firstChild.style.float).toEqual('left');

		render(styleNode(null), container);
		expect(container.firstChild.style.cssText).toEqual('');
		// expect(container.innerHTML).to.eql('<div></div>');
	});

	it('Should remove style attribute when single prop value is null', () => {
		const stylesOne = { float: 'left', color: 'red', display: 'block' };
		render(styleNode(stylesOne), container);
		expect(container.firstChild.style.float).toEqual('left');

		const stylesTwo = { float: 'left', display: 'none' };
		render(styleNode(stylesTwo), container);
		expect(container.firstChild.style.float).toEqual('left');
		expect(container.firstChild.style.display).toEqual('none');
		expect(container.firstChild.style.color).toEqual('');
	});
});
