// TODO: Implement hydration
// import { isArray, isNull, isNullOrUndef, isObject, isStringOrNumber, LifecycleClass, throwError, warning } from 'inferno-shared';
// import VNodeFlags from 'inferno-vnode-flags';
// import { options } from '../core/options';
// import { InfernoChildren, IVNode } from '../core/vnode';
// import { svgNS } from './constants';
// import {
// 	mount,
// 	mountClassComponentCallbacks,
// 	mountElement,
// 	mountFunctionalComponentCallbacks,
// 	mountRef,
// 	mountText
// } from './mounting';
// import { patchProp } from './patching';
// import { componentToDOMNodeMap } from './rendering';
// import { EMPTY_OBJ, handleComponentInput, replaceChild } from './utils';
// import { isControlledFormElement, processElement } from './wrappers/processelements';
//
// function normalizeChildNodes(parentDom) {
// 	let dom = parentDom.firstChild;
//
// 	while (dom) {
// 		if (dom.nodeType === 8) {
// 			if (dom.data === '!') {
// 				const placeholder = document.createTextNode('');
//
// 				parentDom.replaceChild(placeholder, dom);
// 				dom = dom.nextSibling;
// 			} else {
// 				const lastDom = dom.previousSibling;
//
// 				parentDom.removeChild(dom);
// 				dom = lastDom || parentDom.firstChild;
// 			}
// 		} else {
// 			dom = dom.nextSibling;
// 		}
// 	}
// }
//
// const C = options.component;
//
// function hydrateComponent(input: IVNode, dom: Element, lifecycle: LifecycleClass, context, isSVG: boolean, isClass: boolean): Element {
// 	const type = input.type as Function;
// 	const ref = input.ref;
//
// 	input.dom = dom;
//
// 	const props = input.props || EMPTY_OBJ;
//
// 	if (isClass) {
// 		const _isSVG = dom.namespaceURI === svgNS;
// 		const instance = (C.create as Function)(input, type, props, context, _isSVG, lifecycle);
// 		const input = instance._lastInput;
//
// 		hydrate(input, dom, lifecycle, instance._childContext, _isSVG);
// 		mountClassComponentCallbacks(input, ref, instance, lifecycle);
// 		instance._updating = false; // Mount finished allow going sync
// 		if (options.findDOMNodeEnabled) {
// 			componentToDOMNodeMap.set(instance, dom);
// 		}
// 	} else {
// 		const renderOutput = type(props, context);
// 		const input = handleComponentInput(renderOutput, input);
// 		hydrate(input, dom, lifecycle, context, isSVG);
// 		input.children = input;
// 		input.dom = input.dom;
// 		mountFunctionalComponentCallbacks(ref, dom, lifecycle);
// 	}
// 	return dom;
// }
//
// function hydrateElement(input: IVNode, dom: Element, lifecycle: LifecycleClass, context: Object, isSVG: boolean): Element {
// 	const children = input.children;
// 	const props = input.props;
// 	const className = input.className;
// 	const flags = input.flags;
// 	const ref = input.ref;
//
// 	isSVG = isSVG || (flags & VNodeFlags.SvgElement) > 0;
// 	if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== input.type) {
// 		if (process.env.NODE_ENV !== 'production') {
// 			warning('Inferno hydration: Server-side markup doesn\'t match client-side markup or Initial render target is not empty');
// 		}
// 		const newDom = mountElement(input, null, lifecycle, context, isSVG);
//
// 		input.dom = newDom;
// 		replaceChild(dom.parentNode, newDom, dom);
// 		return newDom as Element;
// 	}
// 	input.dom = dom;
// 	if (children) {
// 		hydrateChildren(children, dom, lifecycle, context, isSVG);
// 	} else if (dom.firstChild !== null) {
// 		dom.textContent = ''; // dom has content, but IVNode has no children remove everything from DOM
// 	}
// 	if (props) {
// 		let hasControlledValue = false;
// 		const isFormElement = (flags & VNodeFlags.FormElement) > 0;
// 		if (isFormElement) {
// 			hasControlledValue = isControlledFormElement(props);
// 		}
// 		for (const prop in props) {
// 			// do not add a hasOwnProperty check here, it affects performance
// 			patchProp(prop, null, props[ prop ], dom, isSVG, hasControlledValue);
// 		}
// 		if (isFormElement) {
// 			processElement(flags, input, dom, props, true, hasControlledValue);
// 		}
// 	}
// 	if (!isNullOrUndef(className)) {
// 		if (isSVG) {
// 			dom.setAttribute('class', className);
// 		} else {
// 			dom.className = className;
// 		}
// 	} else {
// 		if (dom.className !== '') {
// 			dom.removeAttribute('class');
// 		}
// 	}
// 	if (ref) {
// 		mountRef(dom, ref, lifecycle);
// 	}
// 	return dom;
// }
//
// function hydrateChildren(children: InfernoChildren, parentDom: Element, lifecycle: LifecycleClass, context: Object, isSVG: boolean): void {
// 	normalizeChildNodes(parentDom);
// 	let dom = parentDom.firstChild;
//
// 	if (isStringOrNumber(children)) {
// 		if (dom && dom.nodeType === 3) {
// 			if (dom.nodeValue !== children) {
// 				dom.nodeValue = children as string;
// 			}
// 		} else if (children) {
// 			parentDom.textContent = children as string;
// 		}
// 		dom = (dom as Element).nextSibling;
// 	} else if (isArray(children)) {
// 		for (let i = 0, len = (children as Array<string | number | IVNode>).length; i < len; i++) {
// 			const child = children[ i ];
//
// 			if (!isNull(child) && isObject(child)) {
// 				if (!isNull(dom)) {
// 					const nextSibling = dom.nextSibling;
// 					hydrate(child as IVNode, dom as Element, lifecycle, context, isSVG);
// 					dom = nextSibling;
// 				} else {
// 					mount(child as IVNode, parentDom, lifecycle, context, isSVG);
// 				}
// 			}
// 		}
// 	} else {
// 		// It's IVNode
// 		hydrate(children as IVNode, dom as Element, lifecycle, context, isSVG);
// 		dom = (dom as Element).nextSibling;
// 	}
//
// 	// clear any other DOM nodes, there should be only a single entry for the root
// 	while (dom) {
// 		const nextSibling = dom.nextSibling;
// 		parentDom.removeChild(dom);
// 		dom = nextSibling;
// 	}
// }
//
// function hydrateText(input: IVNode, dom: Element): Element {
// 	if (dom.nodeType !== 3) {
// 		const newDom = mountText(input, null);
//
// 		input.dom = newDom;
// 		replaceChild(dom.parentNode, newDom, dom);
// 		return newDom;
// 	}
// 	const text = input.children;
//
// 	if (dom.nodeValue !== text) {
// 		dom.nodeValue = text as string;
// 	}
// 	input.dom = dom;
// 	return dom;
// }
//
// function hydrateVoid(input: IVNode, dom: Element): Element {
// 	input.dom = dom;
// 	return dom;
// }
//
// function hydrate(input: IVNode, dom: Element, lifecycle: LifecycleClass, context: Object, isSVG: boolean) {
// 	const flags = input.flags;
//
// 	if (flags & VNodeFlags.Component) {
// 		hydrateComponent(input, dom, lifecycle, context, isSVG, (flags & VNodeFlags.ComponentClass) > 0);
// 	} else if (flags & VNodeFlags.Element) {
// 		hydrateElement(input, dom, lifecycle, context, isSVG);
// 	} else if (flags & VNodeFlags.Text) {
// 		hydrateText(input, dom);
// 	} else if (flags & VNodeFlags.Void) {
// 		hydrateVoid(input, dom);
// 	} else {
// 		if (process.env.NODE_ENV !== 'production') {
// 			throwError(`hydrate() expects a valid IVNode, instead it received an object with the type "${ typeof input }".`);
// 		}
// 		throwError();
// 	}
// }
//
// export function hydrateRoot(input, parentDom: Element|null, lifecycle: LifecycleClass) {
// 	if (!isNull(parentDom)) {
// 		let dom = (parentDom.firstChild as Element);
//
// 		if (!isNull(dom)) {
// 			hydrate(input, dom, lifecycle, EMPTY_OBJ, false);
// 			dom = parentDom.firstChild as Element;
// 			// clear any other DOM nodes, there should be only a single entry for the root
// 			while (dom = dom.nextSibling as Element) {
// 				parentDom.removeChild(dom);
// 			}
// 			return true;
// 		}
// 	}
//
// 	return false;
// }
