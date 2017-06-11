import { createVNode, render } from '../dist-es';
import VNodeFlags from 'inferno-vnode-flags';

describe('patching routine', () => {
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

	it('Should do nothing if lastVNode strictly equals nextVnode', () => {
		const yar = createVNode(2, 'div', null, '123', null, null, null);
		const bar = createVNode(2, 'div', null, '123', null, null, null);
		let foo = createVNode(2, 'div', null, [ bar, yar ], null, null, null);

		render(foo, container);
		expect(container.innerHTML).to.eql('<div><div>123</div><div>123</div></div>');

		foo = createVNode(2, 'div', null, [ bar, yar ], null, null, null);

		render(foo, container);
		expect(container.innerHTML).to.eql('<div><div>123</div><div>123</div></div>');
	});

	// TODO: Check this
	// it('Should mount nextNode if lastNode crashed', () => {
	// 	const validNode = createVNode(
	// 		VNodeFlags.HtmlElement,
	// 		'span',
	// 		null,
	// 		'a',
	// 		null,
	// 		null,
	// 		null
	// 	);
	// 	const invalidNode = createVNode(0, 'span');
	//
	// 	render(validNode, container);
	// 	try {
	// 		render(invalidNode, container);
	// 	} catch (e) {
	// 		expect(e.message.indexOf('Inferno Error: mount() received an object')).to.not.eql(-1);
	// 	}
	// 	expect(container.innerHTML).to.eql('<span>a</span>');
	//
	// 	render(validNode, container);
	// 	expect(container.innerHTML).to.eql('<span>a</span>');
	// });

	it('Patch operation when nextChildren is NOT Invalid/Array/StringOrNumber/VNode', () => {
		const validNode = createVNode(
			VNodeFlags.HtmlElement,
			'span',
			null,
			createVNode(
				VNodeFlags.HtmlElement,
				'span',
				null,
				'a',
				null,
				null,
				null
			),
			null,
			null,
			null
		);

		const invalidChildNode = createVNode(
			VNodeFlags.HtmlElement,
			'span',
			null,
			createVNode(0, 'span'),
			null,
			null,
			null
		);

		render(validNode, container);
		render(invalidChildNode, container);
	});

	it('Should not access real DOM property when text does not change', () => {
		render(createVNode(VNodeFlags.HtmlElement, 'div', null, 'a'), container);
		expect(container.innerHTML).to.eql('<div>a</div>');
		render(createVNode(VNodeFlags.HtmlElement, 'div', null, 'a'), container);
		expect(container.innerHTML).to.eql('<div>a</div>');
	});
});
