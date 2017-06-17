// import createElement from 'inferno-create-element';
// import isValidElement from '../dist-es/isValidElement';
// import { cloneVNode } from 'inferno';
// import h from 'inferno-hyperscript';
// import Component from 'inferno-component';
//
//
// describe('isValidElement', () => {
// 	it('Should not work with non-object', () => {
// 		expect(isValidElement(33)).toEqual(false);
// 		expect(isValidElement(false)).toEqual(false);
// 		expect(isValidElement(true)).toEqual(false);
// 		expect(isValidElement('some text')).toEqual(false);
// 		expect(isValidElement(0)).toEqual(false);
// 		expect(isValidElement(undefined)).toEqual(false);
// 	});
//
// 	it('Should not work with invalid object', () => {
// 		expect(isValidElement(null)).toEqual(false, 'object should not be null');
// 		expect(isValidElement({})).toEqual(false, 'object should not be empty');
// 		expect(isValidElement({ dom: 'fake data' })).toEqual(false, 'object should not have just a dom property');
// 	});
//
// 	it('Should not work with a number', () => {
// 		expect(isValidElement(33)).toEqual(false);
// 	});
//
// 	it('Should work with createElement (element)', () => {
// 		const el = createElement('div', null, 'Do a thing');
// 		expect(isValidElement(el)).toEqual(true);
// 	});
//
// 	it('Should work with createElement (stateless component)', () => {
// 		const el = createElement('div', null, 'Do a thing');
// 		const Comp = () => el;
// 		const comp = createElement(Comp);
// 		expect(isValidElement(comp)).toEqual(true);
// 	});
//
// 	it('Should work with createElement (stateful component)', () => {
// 		class Comp extends Component {
// 			render() {
// 				return createElement('div', null, 'Do a thing');
// 			}
// 		}
// 		const comp = createElement(Comp);
// 		expect(isValidElement(comp)).toEqual(true);
// 	});
//
// 	it('Should work with JSX', () => {
// 		const node = <div>Hello world</div>;
// 		expect(isValidElement(node)).toEqual(true);
// 	});
//
// 	// it('Should work with cloneVNode', () => {
// 	// 	const node = <div>Hello world</div>;
// 	// 	const clonedNode = cloneVNode(node, null, 'Hello world 2!');
// 	// 	expect(isValidElement(clonedNode)).toEqual(true);
// 	// });
//
// 	it('Should work with hyperscript (element)', () => {
// 		const el = h('div', 'Do a thing');
// 		expect(isValidElement(el)).toEqual(true);
// 	});
//
// 	it('Should work with hyperscript (stateless component)', () => {
// 		const el = h('div', 'Do a thing');
// 		const Comp = () => el;
// 		const comp = h(Comp);
// 		expect(isValidElement(comp)).toEqual(true);
// 	});
//
// 	it('Should work with hyperscript (stateful component)', () => {
// 		class Comp extends Component {
// 			render() {
// 				return h('div', 'Do a thing');
// 			}
// 		}
// 		const comp = h(Comp);
// 		expect(isValidElement(comp)).toEqual(true);
// 	});
//
// 	it('Should not work with a stateless component (using createElement)', () => {
// 		const el = createElement('div', null, 'Do a thing');
// 		const Comp = () => el;
// 		expect(isValidElement(Comp)).toEqual(false);
// 	});
//
// 	it('Should not work with a stateless component (using hyperscript)', () => {
// 		const el = h('div', 'Do a thing');
// 		const Comp = () => el;
// 		expect(isValidElement(Comp)).toEqual(false);
// 	});
//
// 	it('Should not work with a stateful component (using createElement)', () => {
// 		class Comp extends Component {
// 			render() {
// 				return createElement('div', null, 'Do a thing');
// 			}
// 		}
// 		expect(isValidElement(Comp)).toEqual(false);
// 	});
//
// 	it('Should not work with a stateful component (using hyperscript)', () => {
// 		class Comp extends Component {
// 			render() {
// 				return h('div', 'Do a thing');
// 			}
// 		}
// 		expect(isValidElement(Comp)).toEqual(false);
// 	});
// });
