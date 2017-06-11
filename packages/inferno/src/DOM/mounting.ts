import {
	isArray,
	isFunction,
	isInvalid,
	isNull,
	isNullOrUndef,
	isObject,
	isStringOrNumber,
	isUndefined,
	LifecycleClass,
	throwError
} from 'inferno-shared';
import VNodeFlags from 'inferno-vnode-flags';
import { options } from '../core/options';
import { isVNode, IVNode } from '../core/vnode';
import { patchProp } from './patching';
import { recycleComponent, recycleElement } from './recycling';
import { componentToDOMNodeMap } from './rendering';
import { appendChild, documentCreateElement, EMPTY_OBJ, handleComponentInput, setTextContent } from './utils';
import { isControlledFormElement, processElement } from './wrappers/processelements';
import { IFiber, Fiber } from '../core/fiber';

export function mount(fiber: IFiber, input: IVNode|string|number|null|undefined|false|true, parentDom: Element|null, lifecycle: LifecycleClass, context: Object, isSVG: boolean) {
	// if (!isInvalid(input)) {
		// Text - Number
		if (isStringOrNumber(input)) {
			mountText(fiber, input, parentDom);
		} else {
			// VNode
			const flags = (input as IVNode).flags;

			if (flags & VNodeFlags.Element) {
				mountElement(fiber, input, parentDom, lifecycle, context, isSVG);
			} else if (flags & VNodeFlags.Component) {
				mountComponent(input, parentDom, lifecycle, context, isSVG, (flags & VNodeFlags.ComponentClass) > 0);
			} else if (flags & VNodeFlags.Void) {
				// TODO: Is this Void needed anymore?
				mountVoid(fiber, parentDom);
			} else {
				if (process.env.NODE_ENV !== 'production') {
					if (typeof input === 'object') {
						throwError(`mount() received an object that's not a valid VNode, you should stringify it first. Object: "${ JSON.stringify(input) }".`);
					} else {
						throwError(`mount() expects a valid VNode, instead it received an object with the type "${ typeof input }".`);
					}
				}
				throwError();
			}
		}
	// }
}

export function mountText(fiber: IFiber, text: string|number, parentDom: Element|null): any {
	const dom = document.createTextNode(text as string);

	fiber.input = text;
	if (!isNull(parentDom)) {
		fiber.dom = dom as any;
		appendChild(parentDom, dom);
	}

	return dom;
}

export function mountVoid(fiber: IFiber, parentDom: Element|null) {
	return mountText(fiber, '', parentDom);
}

export function mountElement(fiber: IFiber, vNode: IVNode, parentDom: Element|null, lifecycle: LifecycleClass, context: {}, isSVG: boolean) {
	if (options.recyclingEnabled) {
		const dom = recycleElement(vNode, lifecycle, context, isSVG);

		if (!isNull(dom)) {
			if (!isNull(parentDom)) {
				appendChild(parentDom, dom);
			}
			return dom;
		}
	}
	const flags = vNode.flags;

	isSVG = isSVG || (flags & VNodeFlags.SvgElement) > 0;
	const dom = documentCreateElement(vNode.type, isSVG);
	const children = vNode.children;
	const props = vNode.props;
	const className = vNode.className;
	const ref = vNode.ref;

	fiber.dom = dom; // Store DOM reference into fiber, to keep input stateless

	if (!isInvalid(children)) {
		if (isStringOrNumber(children)) {
			// Text
			setTextContent(dom, children as string | number);
		} else {
			const childrenIsSVG = isSVG === true && vNode.type !== 'foreignObject';
			if (isArray(children)) {
				// Array
				mountArrayChildren(fiber, children, dom, lifecycle, context, childrenIsSVG, '');
			} else {
				// VNode
				const childFiber = new Fiber(children as IVNode, '0');

				fiber.children = childFiber;

				mount(childFiber, children as IVNode, dom, lifecycle, context, childrenIsSVG);
			}
		}
	}
	if (!isNull(props)) {
		let hasControlledValue = false;
		const isFormElement = (flags & VNodeFlags.FormElement) > 0;
		if (isFormElement) {
			hasControlledValue = isControlledFormElement(props);
		}
		for (const prop in props) {
			// do not add a hasOwnProperty check here, it affects performance
			patchProp(prop, null, props[ prop ], dom, isSVG, hasControlledValue);
		}
		if (isFormElement) {
			processElement(flags, vNode, dom, props, true, hasControlledValue);
		}
	}

	if (className !== null) {
		if (isSVG) {
			dom.setAttribute('class', className);
		} else {
			dom.className = className;
		}
	}

	if (!isNull(ref)) {
		mountRef(dom, ref, lifecycle);
	}
	if (!isNull(parentDom)) {
		appendChild(parentDom, dom);
	}
	return dom;
}

export function mountArrayChildren(fiber, children, dom: Element, lifecycle: LifecycleClass, context: Object, isSVG: boolean, prefix: string) {
	for (let i = 0, len = children.length; i < len; i++) {
		const child = children[ i ];

		// Verify can string/number be here. might cause de-opt. - Normalization takes care of it.
		if (!isInvalid(child)) {
			if (fiber.children === null) {
				fiber.children = [];
			}
			if (isArray(child)) {
				// TODO: Add warning about nested arrays?
				mountArrayChildren(fiber, child, dom, lifecycle, context, isSVG, prefix + (i + 1) + '.');
			} else {
				const childFiber = new Fiber(child, prefix + (i + 1));
				fiber.children.push(childFiber);
				mount(childFiber, child, dom, lifecycle, context, isSVG);
			}
		}
	}
}

const C = options.component;

export function mountComponent(vNode: IVNode, parentDom: Element|null, lifecycle: LifecycleClass, context: Object, isSVG: boolean, isClass: boolean) {
	// if (options.recyclingEnabled) {
	// 	const dom = recycleComponent(vNode, lifecycle, context, isSVG);
	//
	// 	if (!isNull(dom)) {
	// 		if (!isNull(parentDom)) {
	// 			appendChild(parentDom, dom);
	// 		}
	// 		return dom;
	// 	}
	// }
	// const type = vNode.type as Function;
	// const props = vNode.props || EMPTY_OBJ;
	// const ref = vNode.ref;
	// let dom;
	// if (isClass) {
	// 	const instance = (C.create as Function)(vNode, type, props, context, isSVG, lifecycle);
	// 	const input = instance._lastInput;
	//
	// 	vNode.dom = dom = mount(input, null, lifecycle, instance._childContext, isSVG);
	// 	if (!isNull(parentDom)) {
	// 		appendChild(parentDom, dom);
	// 	}
	// 	mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
	// 	instance._updating = false;
	// 	if (options.findDOMNodeEnabled) {
	// 		componentToDOMNodeMap.set(instance, dom);
	// 	}
	// } else {
	// 	const renderOutput = type(props, context);
	// 	const input = handleComponentInput(renderOutput, vNode);
	//
	// 	vNode.dom = dom = mount(input, null, lifecycle, context, isSVG);
	// 	vNode.children = input;
	// 	mountFunctionalComponentCallbacks(ref, dom, lifecycle);
	// 	if (!isNull(parentDom)) {
	// 		appendChild(parentDom, dom);
	// 	}
	// }
	// return dom;
}

export function mountClassComponentCallbacks(vNode: IVNode, ref, instance, lifecycle: LifecycleClass) {
	if (ref) {
		if (isFunction(ref)) {
			ref(instance);
		} else {
			if (process.env.NODE_ENV !== 'production') {
				if (isStringOrNumber(ref)) {
					throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
				} else if (isObject(ref) && (vNode.flags & VNodeFlags.ComponentClass)) {
					throwError('functional component lifecycle events are not supported on ES2015 class components.');
				} else {
					throwError(`a bad value for "ref" was used on component: "${ JSON.stringify(ref) }"`);
				}
			}
			throwError();
		}
	}
	const hasDidMount = !isUndefined(instance.componentDidMount);
	const afterMount = options.afterMount;

	if (hasDidMount || !isNull(afterMount)) {
		lifecycle.addListener(() => {
			instance._updating = true;
			if (afterMount) {
				afterMount(vNode);
			}
			if (hasDidMount) {
				instance.componentDidMount();
			}
			instance._updating = false;
		});
	}
}

export function mountFunctionalComponentCallbacks(ref, dom, lifecycle: LifecycleClass) {
	if (ref) {
		if (!isNullOrUndef(ref.onComponentWillMount)) {
			ref.onComponentWillMount();
		}
		if (!isNullOrUndef(ref.onComponentDidMount)) {
			lifecycle.addListener(() => ref.onComponentDidMount(dom));
		}
	}
}

export function mountRef(dom: Element, value, lifecycle: LifecycleClass) {
	if (isFunction(value)) {
		lifecycle.addListener(() => value(dom));
	} else {
		if (isInvalid(value)) {
			return;
		}
		if (process.env.NODE_ENV !== 'production') {
			throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
		}
		throwError();
	}
}
