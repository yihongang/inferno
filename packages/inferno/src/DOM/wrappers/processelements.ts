import { isNullOrUndef } from 'inferno-shared';
import VNodeFlags from 'inferno-vnode-flags';
import { IVNode } from '../../core/vnode';
import { isCheckedType, processInput } from './inputwrapper';
import { processSelect } from './selectwrapper';
import { processTextarea } from './textareawrapper';

/**
 * There is currently no support for switching same input between controlled and nonControlled
 * If that ever becomes a real issue, then re design controlled elements
 * Currently user must choose either controlled or non-controlled and stick with that
 */

export function processElement(flags: number, vNode: IVNode, dom: Element, nextPropsOrEmpty, mounting: boolean, isControlled: boolean): void {
	if (flags & VNodeFlags.InputElement) {
		processInput(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
	}
	if (flags & VNodeFlags.SelectElement) {
		processSelect(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
	}
	if (flags & VNodeFlags.TextareaElement) {
		processTextarea(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
	}
}

export function isControlledFormElement(nextPropsOrEmpty): boolean {
	return (nextPropsOrEmpty.type && isCheckedType(nextPropsOrEmpty.type)) ? !isNullOrUndef(nextPropsOrEmpty.checked) : !isNullOrUndef(nextPropsOrEmpty.value);
}
