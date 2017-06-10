import { render, createVNode } from './../dist-es/index';

const comparer = document.createElement('div');

function innerHTML(HTML) {
	comparer.innerHTML = HTML;
	return comparer.innerHTML;
}

describe('Basic use-cases', () => {
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

	it('Should be possible to render and remove single div', () => {
		render(createVNode(2, 'div', '1st-test', '2', null, null, null), container);

		expect(innerHTML(container.innerHTML)).to.equal(innerHTML('<div class="1st-test">2</div>'));

		render(null, container);

		expect(innerHTML(container.innerHTML)).to.equal('');
	});

	it('Should be possible to render and unmount single div with 2 text nodes as children', () => {
		render(createVNode(2, 'div', '1st-test', [ '1', '2' ], null, null, null), container);

		expect(innerHTML(container.innerHTML)).to.equal(innerHTML('<div class="1st-test">12</div>'));

		render(null, container);

		expect(innerHTML(container.innerHTML)).to.equal('');
	});

	it('Should be possible to render and unmount text nodes #1', () => {
		render(createVNode(2, 'div', '1st-test', [ '1', '2', '3' ], null, null, null), container);

		expect(innerHTML(container.innerHTML)).to.equal(innerHTML('<div class="1st-test">123</div>'));

		render(null, container);

		expect(innerHTML(container.innerHTML)).to.equal('');


		render(createVNode(2, 'div', '1st-test', [ '1', '3' ], null, null, null), container);

		debugger;
		expect(innerHTML(container.innerHTML)).to.equal(innerHTML('<div class="1st-test">13</div>'));

		render(createVNode(2, 'div', '1st-test', [ '1', '3', '4' ], null, null, null), container);

		expect(innerHTML(container.innerHTML)).to.equal(innerHTML('<div class="1st-test">134</div>'));

		debugger;

		render(createVNode(2, 'div', '1st-test', ['4'], null, null, null), container);

		expect(innerHTML(container.innerHTML)).to.equal(innerHTML('<div class="1st-test">4</div>'));

		render(createVNode(2, 'div', '1st-test', [ '4', '4' ], null, null, null), container);

		expect(innerHTML(container.innerHTML)).to.equal(innerHTML('<div class="1st-test">44</div>'));

		render(createVNode(2, 'div', '1st-test', null, null, null, null), container);

		expect(innerHTML(container.innerHTML)).to.equal(innerHTML('<div class="1st-test"></div>'));

		render(createVNode(2, 'div', '1st-test', '', null, null, null), container);

		expect(innerHTML(container.innerHTML)).to.equal(innerHTML('<div class="1st-test"></div>'));

		render(createVNode(2, 'div', '1st-test', [], null, null, null), container);

		expect(innerHTML(container.innerHTML)).to.equal(innerHTML('<div class="1st-test"></div>'));
	});
});
