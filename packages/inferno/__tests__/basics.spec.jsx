import { render } from 'inferno';

const comparer = document.createElement('div');
function innerHTML(HTML) {
  comparer.innerHTML = HTML;
  return comparer.innerHTML;
}

describe('Basic JSX', () => {
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


  it('Should work correctly when removing nodes', () => {
    function Functional({children}) {
      return (
        <div>
          {children}
        </div>
      );
    }

    render(createVNode(2, 'div', null, [ <Functional>{['1', '2', '3']}</Functional>, <Functional>{['4', '5']}</Functional> ], null, null, null), container);

    expect(innerHTML(container.innerHTML)).toEqual(innerHTML('<div><div>123</div><div>45</div></div>'));

    render(createVNode(2, 'div', null, [ <Functional>{['3', '4', '5']}</Functional>, <Functional>{['6', '7']}</Functional> ], null, null, null), container);

    expect(innerHTML(container.innerHTML)).toEqual(innerHTML('<div><div>345</div><div>67</div></div>'));

    render(createVNode(2, 'div', null, [ <Functional>{['3', '4', '5']}</Functional>, <Functional>{['6', '7']}</Functional>, <Functional>{['3', '4', '5']}</Functional> ], null, null, null), container);

    expect(innerHTML(container.innerHTML)).toEqual(innerHTML('<div><div>345</div><div>67</div><div>345</div></div>'));
  });
});
