import {
	isStringOrNumber,
	isArray
} from '../shared';
import {
	createTextVNode,
	createFragmentVNode
} from '../core/shapes';

export function normalize(input) {
	if (isStringOrNumber(input)) {
		return createTextVNode(input);
	} else if (isArray(input)) {
		return createFragmentVNode(input);
	}
	return input;
}