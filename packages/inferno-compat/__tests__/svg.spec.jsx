//
// import { render } from 'inferno';
// import { createElement } from '../dist-es';
//
// describe('svg', () => {
// 	let container;
//
// 	beforeEach(function () {
// 		container = document.createElement('div');
// 	});
//
// 	afterEach(function () {
// 		render(null, container);
// 	});
//
// 	it('Should work with normal svg attributes', () => {
// 		render(createElement('svg', {
// 			height: '16',
// 			width: '16',
// 			viewBox: '0 0 1024 1024'
// 		}, [
// 			createElement('stop', {
// 				offset: 0,
// 				stopColor: 'white',
// 				stopOpacity: 0.5
// 			})
// 		]), container);
//
// 		expect(container.firstChild.getAttribute('viewBox')).toEqual('0 0 1024 1024');
// 		expect(container.firstChild.getAttribute('height')).toEqual('16');
// 		expect(container.firstChild.getAttribute('width')).toEqual('16');
// 		expect(container.firstChild.firstChild.tagName).toEqual('stop');
// 		expect(container.firstChild.firstChild.getAttribute('stop-color')).toEqual('white');
// 		expect(container.firstChild.firstChild.getAttribute('stop-opacity')).toEqual('0.5');
// 	});
//
// 	it('Should work with namespace svg attributes', () => {
// 		render(createElement('svg', null, [
// 			createElement('image', {
// 				xlinkHref: 'http://i.imgur.com/w7GCRPb.png'
// 			})
// 		]), container);
//
// 		expect(container.firstChild.firstChild.tagName).toEqual('image');
// 		expect(container.firstChild.firstChild.getAttribute('xlink:href')).toEqual('http://i.imgur.com/w7GCRPb.png');
// 	});
// });
