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

export function normalize(input) {
	if (isInvalid(input)) {
		return createVoidVNode();
	} else if (isStringOrNumber(input)) {
		return createTextVNode(input);
	} else if (isArray(input)) {
		return createFragmentVNode(input);
	}
	return input;
}