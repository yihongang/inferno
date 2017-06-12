import { LifecycleClass } from 'inferno-shared';
import { IVNode } from './vnode';

export interface IFiber {
	input: IVNode|string|number;
	children: null|IFiber|IFiber[];
	dom: null|Element;
	lifeCycle: LifecycleClass;
	// pos is used to track point in vNode tree
	i: string;
	// c is possible component instance
	c: any;
}

/**
 * Fiber represents internal vNode tree, which holds the reference to actual DOM.
 * This way user land virtual nodes become stateless and can be moved / hoisted / swapped freely at application level
 * @param {object|string|number} input reference to vNode or string of this Fiber
 * @param {string} i location of current Fiber in fiber tree
 * @constructor
 */
export function Fiber(input, i) {
	this.input = input;
	this.dom = null;
	this.children = null; // This value is null for Fibers that hold text nodes
	this.lifeCycle = null;
	this.i = i;
	this.c = null;
}
