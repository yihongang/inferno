import {
	isNullOrUndef,
	isStatefulComponent,
	isUndefined,
	isString,
	isNull
} from '../shared';

export interface Styles {
	[key: string]: number | string;
}

export interface IProps {
	[index: string]: any;
}
export interface VType {
	flags: VNodeFlags;
}

export type InfernoInput = VNode | VNode[] | null | string | string[] | number | number[];

export const enum VNodeFlags {
	Text = 1,
	HtmlElement = 1 << 1,

	ComponentClass = 1 << 2,
	ComponentFunction = 1 << 3,
	ComponentUnknown = 1 << 4,

	HasKeyedChildren = 1 << 5,
	HasNonKeyedChildren = 1 << 6,

	SvgElement = 1 << 7,
	MediaElement = 1 << 8,
	InputElement = 1 << 9,
	TextareaElement = 1 << 10,
	SelectElement = 1 << 11,
	Void = 1 << 12,
	Fragment = 1 << 13,

	Element = HtmlElement | SvgElement | MediaElement | InputElement | TextareaElement | SelectElement,
	Component = ComponentFunction | ComponentClass | ComponentUnknown
}

export interface VNode {
	children: string | Array<string | VNode> | VNode | null;
	dom: Node | null;
	events: Object | null;
	flags: VNodeFlags;
	key: string | number | null;
	props: Object | null;
	ref: Function | null;
	type: string | Function | null;
}

function normalizeProps(vNode, props, children) {
	if (!(vNode.flags & VNodeFlags.Component) && isNullOrUndef(children) && !isNullOrUndef(props.children)) {
		vNode.children = props.children;
	}
	if (props.ref) {
		vNode.ref = props.ref;
	}
	if (props.events) {
		vNode.events = props.events;
	}
	if (!isNullOrUndef(props.key)) {
		vNode.key = props.key;
	}
}

function normalizeElement(type, vNode) {
	if (type === 'svg') {
		vNode.flags = VNodeFlags.SvgElement;
	} else if (type === 'input') {
		vNode.flags = VNodeFlags.InputElement;
	} else if (type === 'select') {
		vNode.flags = VNodeFlags.SelectElement;
	} else if (type === 'textarea') {
		vNode.flags = VNodeFlags.TextareaElement;
	} else if (type === 'media') {
		vNode.flags = VNodeFlags.MediaElement;
	} else {
		vNode.flags = VNodeFlags.HtmlElement;
	}
	if (vNode.props.children) {
		vNode.children = vNode.props.children;
	}
}

function normalize(vNode) {
	const props = vNode.props;
	const type = vNode.type;

	// convert a wrongly created type back to element
	if (isString(type) && (vNode.flags & VNodeFlags.Component)) {
		normalizeElement(type, vNode);
	}
	if (props) {
		normalizeProps(vNode, props, vNode.children);
	}
}

export function createVNode(flags, type?, props?, children?, events?, key?, ref?): VNode {
	if (flags & VNodeFlags.ComponentUnknown) {
		flags = isStatefulComponent(type) ? VNodeFlags.ComponentClass : VNodeFlags.ComponentFunction;
	}
	const vNode = {
		children: isUndefined(children) ? null : children,
		dom: null,
		events: events || null,
		flags: flags || 0,
		key: key === undefined ? null : key,
		props: props || null,
		ref: ref || null,
		type
	};
	normalize(vNode);
	return vNode;
}

export function createVoidVNode() {
	return createVNode(VNodeFlags.Void);
}

export function createTextVNode(text) {
	return createVNode(VNodeFlags.Text, null, null, text);
}

export function createFragmentVNode(children) {
	return {
		dom: children,
		flags: VNodeFlags.Fragment,
		key: null
	};
}

export function isVNode(o: VType): boolean {
	return !!o.flags;
}
