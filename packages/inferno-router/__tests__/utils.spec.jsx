// import { isEmpty, mapSearchParams } from '../dist-es/utils';
//
// describe('Router #utils', () => {
// 	it('it should map search params to object', () => {
// 		let params;
// 		params = mapSearchParams('hello=world');
// 		expect(params.hello).toEqual('world');
//
// 		params = mapSearchParams('hello=world&utf8=çava-oui');
// 		expect(params.utf8).toEqual('çava-oui');
//
// 		params = mapSearchParams('arr[]=one&arr[]=two&arr[]=çava-oui');
// 		expect(params.arr[ 2 ]).toEqual('çava-oui');
// 	});
//
// 	it('it should return true for an empty object or array', () => {
// 		expect(isEmpty([])).toEqual(true);
// 		expect(isEmpty({})).toEqual(true);
// 		expect(isEmpty(Object.create(null))).toEqual(true);
// 	});
// });
