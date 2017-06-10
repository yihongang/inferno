import { IFiber } from './fiber';

export const options: {
	afterMount: null|Function
	afterRender: null|Function
	afterUpdate: null|Function
	beforeRender: null|Function
	beforeUnmount: null|Function
	createVNode: null|Function
	component: {
		create: null|Function
		flush: null|Function
		handleInput: null|Function
		patch: null|Function
		rendering: boolean
	},
	findDOMNodeEnabled: boolean
	recyclingEnabled: boolean
	roots: Map<any, IFiber>
} = {
	afterMount: null,
	afterRender: null,
	afterUpdate: null,
	beforeRender: null,
	beforeUnmount: null,
	component: {
		create: null,
		flush: null,
		handleInput: null,
		patch: null,
		rendering: false
	},
	createVNode: null,
	findDOMNodeEnabled: false,
	recyclingEnabled: false,
	roots: new Map()
};
