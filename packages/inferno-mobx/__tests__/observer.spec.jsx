import { expect } from 'chai';
import { observable, action } from 'mobx';
import { innerHTML } from 'inferno/test/utils';
import { observer } from '../dist-es';
import createClass from 'inferno-create-class';
import * as Inferno from 'inferno';
const render = Inferno.render

describe('MobX observer()', () => {
	let container;

	const store = observable({
		todos: [{
			title: 'a',
			completed: false
		}]
	});

	let todoItemRenderings = 0;
	const TodoItem = observer(function TodoItem(props) {
		todoItemRenderings++;
		return <li>|{ props.todo.title }</li>
	});

	let todoListRenderings = 0;
	let todoListWillReactCount = 0;
	const TodoList = observer(createClass({
		renderings: 0,
		componentWillReact() {
			todoListWillReactCount++;
		},
		render() {
			todoListRenderings++;
			const todos = store.todos;
			return (
				<div>
					<hi>{ todos.length }</hi>
					{ todos.map((todo, idx) => <TodoItem key={ idx } todo={ todo } />) }
				</div>
			)
		}
	}));

	const App = () => <TodoList />
	const getDNode = (obj, prop) => obj.$mobx.values[prop]
	function query(q) {
		return Array.prototype.slice.call(document.querySelectorAll(q));
	}

	beforeEach(() => {
		container = document.createElement('div');
		container.style.display = 'none';
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
		render(null, container);
	});

	it('Nested rendering should work', (done) => {
		render(<App />, container)
		expect(todoListRenderings).to.equal(1); //, 'should have rendered list once');
		expect(todoListWillReactCount).to.equal(0); //, 'should not have reacted yet')

		expect(query('li').length).to.equal(1);
		expect(query('li')[0].innerHTML).to.equal('|a');

		expect(todoItemRenderings).to.equal(1) //, 'item1 should render once');

		expect(getDNode(store, 'todos').observers.length).to.equal(1);
		expect(getDNode(store.todos[0], 'title').observers.length).to.equal(1);

		store.todos[0].title += 'a';

		setTimeout(() => {
			expect(todoListRenderings).to.equal(1); // should have rendered list once
			expect(todoListWillReactCount).to.equal(0); // should not have reacted
			expect(todoItemRenderings).to.equal(2); // item1 should have rendered twice
			expect(getDNode(store, 'todos').observers.length).to.equal(1); // observers count shouldn\'t change
			expect(getDNode(store.todos[0], 'title').observers.length).to.equal(1); // title observers should not have increased

			store.todos.push({
				title: 'b',
				completed: true
			});

			setTimeout(() => {
				expect(query('li').length).to.equal(2); // list should have two items in in the list
				expect(query('li')[0].innerHTML + query('li')[1].innerHTML).to.equal('|aa|b');

				expect(todoListRenderings).to.equal(2); // should have rendered list twice
				expect(todoListWillReactCount).to.equal(1); // should have reacted
				expect(todoItemRenderings).to.equal(3); // item2 should have rendered as well
				expect(getDNode(store.todos[1], 'title').observers.length).to.equal(1); // title observers should have increased
				expect(getDNode(store.todos[1], 'completed').observers.length).to.equal(0); // completed observers should not have increased

				const oldTodo = store.todos.pop();
				setTimeout(() => {
					expect(todoListRenderings).to.equal(3); // should have rendered list another time
					expect(todoListWillReactCount).to.equal(2); // should have reacted
					expect(todoItemRenderings).to.equal(3); // item1 should not have rerendered
					expect(query('li').length).to.equal(1); // list should have only on item in list now
					expect(getDNode(oldTodo, 'title').observers.length).to.equal(0); // title observers should have decreased
					expect(getDNode(oldTodo, 'completed').observers.length).to.equal(0); // completed observers should not have decreased
					done()
				});
			}, 100);
		}, 100);
	});
});
