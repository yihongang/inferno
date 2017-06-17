//
// import { renderReporter as EventEmitter } from '../dist-es';
//
// const testdata = {
// 	testKey: 'testdata'
// };
// const testListener = function (data) {
// 	expect(data).toEqual(testdata);
// };
//
// describe('old - mobx - EventEmitter', () => {
// 	it('should have an empty listner array on construction', () => {
// 		const unit = new EventEmitter();
// 		expect(unit.listeners.length).toEqual(0);
// 	});
//
// 	it('should add a listener and allow to remove it', () => {
// 		const unit = new EventEmitter();
// 		const removeListener = unit.on(testListener);
//
// 		expect(unit.listeners.length).toEqual(1);
//
// 		removeListener();
//
// 		expect(unit.listeners.length).toEqual(0);
// 	});
//
// 	it('should all data to be emmitted by the listners', () => {
// 		const unit = new EventEmitter();
// 		const removeListener = unit.on(testListener);
//
// 		unit.emit(testdata);
//
// 		removeListener();
// 	});
// });
