import {
	isStringOrNumber,
	isArray,
	isInvalid
} from '../shared';
import {
	createTextVNode,
	createFragmentVNode,
	createVoidVNode
} from '../core/shapes';
import cloneVNode from '../factories/cloneVNode';

export function normalize(input) {
	if (isInvalid(input)) {
		return createVoidVNode();
	} else if (isStringOrNumber(input)) {
		return createTextVNode(input);
	} else if (isArray(input)) {
		return createFragmentVNode(input);
	} else if (input.dom && !isArray(input.dom)) {
		return cloneVNode(input);
	}
	return input;
}

export function normalizeArray(array) {
	if (!array.$) {
		array.$ = 1;
	} else {
		const newArray = array.slice();

		newArray.$ = 1;
		return newArray;
	}
	return array;
}