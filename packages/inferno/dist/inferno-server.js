/*!
 * inferno-server v1.0.0-beta6
 * (c) 2016 Dominic Gannaway
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('stream')) :
	typeof define === 'function' && define.amd ? define(['stream'], factory) :
	(global.InfernoServer = factory(global.stream));
}(this, (function (stream) { 'use strict';

var ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';


function isArray(obj) {
    return obj instanceof Array;
}

function isStringOrNumber(obj) {
    return isString(obj) || isNumber(obj);
}
function isNullOrUndef(obj) {
    return isUndefined(obj) || isNull(obj);
}
function isInvalid(obj) {
    return isNull(obj) || obj === false || isTrue(obj) || isUndefined(obj);
}


function isString(obj) {
    return typeof obj === 'string';
}
function isNumber(obj) {
    return typeof obj === 'number';
}
function isNull(obj) {
    return obj === null;
}
function isTrue(obj) {
    return obj === true;
}
function isUndefined(obj) {
    return obj === undefined;
}

function throwError(message) {
    if (!message) {
        message = ERROR_MSG;
    }
    throw new Error(("Inferno Error: " + message));
}

function constructDefaults(string, object, value) {
    /* eslint no-return-assign: 0 */
    string.split(',').forEach(function (i) { return object[i] = value; });
}
var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';

var strictProps = {};
var booleanProps = {};
var namespaces = {};
var isUnitlessNumber = {};
constructDefaults('xlink:href,xlink:arcrole,xlink:actuate,xlink:role,xlink:titlef,xlink:type', namespaces, xlinkNS);
constructDefaults('xml:base,xml:lang,xml:space', namespaces, xmlNS);
constructDefaults('volume,value,defaultValue,defaultChecked', strictProps, true);
constructDefaults('muted,scoped,loop,open,checked,default,capture,disabled,selected,readonly,multiple,required,autoplay,controls,seamless,reversed,allowfullscreen,novalidate', booleanProps, true);
constructDefaults('animationIterationCount,borderImageOutset,borderImageSlice,borderImageWidth,boxFlex,boxFlexGroup,boxOrdinalGroup,columnCount,flex,flexGrow,flexPositive,flexShrink,flexNegative,flexOrder,gridRow,gridColumn,fontWeight,lineClamp,lineHeight,opacity,order,orphans,tabSize,widows,zIndex,zoom,fillOpacity,floodOpacity,stopOpacity,strokeDasharray,strokeDashoffset,strokeMiterlimit,strokeOpacity,strokeWidth,', isUnitlessNumber, true);

function escapeText(str) {
    return (str + '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\//g, '&#x2F;');
}
function escapeAttr(str) {
    return (str + '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;');
}
function toHyphenCase(str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}
var voidElements = {
    area: true,
    base: true,
    br: true,
    col: true,
    command: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
};
function isVoidElement(str) {
    return !!voidElements[str];
}

var VNodeFlags;
(function (VNodeFlags) {
    VNodeFlags[VNodeFlags["Text"] = 1] = "Text";
    VNodeFlags[VNodeFlags["HtmlElement"] = 2] = "HtmlElement";
    VNodeFlags[VNodeFlags["ComponentClass"] = 4] = "ComponentClass";
    VNodeFlags[VNodeFlags["ComponentFunction"] = 8] = "ComponentFunction";
    VNodeFlags[VNodeFlags["HasKeyedChildren"] = 16] = "HasKeyedChildren";
    VNodeFlags[VNodeFlags["HasNonKeyedChildren"] = 32] = "HasNonKeyedChildren";
    VNodeFlags[VNodeFlags["SvgElement"] = 64] = "SvgElement";
    VNodeFlags[VNodeFlags["MediaElement"] = 128] = "MediaElement";
    VNodeFlags[VNodeFlags["InputElement"] = 256] = "InputElement";
    VNodeFlags[VNodeFlags["TextAreaElement"] = 512] = "TextAreaElement";
    VNodeFlags[VNodeFlags["Fragment"] = 1024] = "Fragment";
    VNodeFlags[VNodeFlags["Void"] = 2048] = "Void";
    VNodeFlags[VNodeFlags["Element"] = 962] = "Element";
    VNodeFlags[VNodeFlags["Component"] = 12] = "Component";
})(VNodeFlags || (VNodeFlags = {}));
function _normaliseVNodes(nodes, result, i) {
    for (; i < nodes.length; i++) {
        var n = nodes[i];
        if (!isInvalid(n)) {
            if (Array.isArray(n)) {
                _normaliseVNodes(n, result, 0);
            }
            else {
                if (isStringOrNumber(n)) {
                    n = createTextVNode(n);
                }
                result.push(n);
            }
        }
    }
}
function normaliseVNodes(nodes) {
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (isInvalid(n) || Array.isArray(n)) {
            var result = nodes.slice(0, i);
            _normaliseVNodes(nodes, result, i);
            return result;
        }
        else if (isStringOrNumber(n)) {
            nodes[i] = createTextVNode(n);
        }
    }
    return nodes;
}
function createVNode(flags, type, props, children, key, ref) {
    if (isArray(children)) {
        children = normaliseVNodes(children);
    }
    return {
        children: isUndefined(children) ? null : children,
        dom: null,
        flags: flags || 0,
        key: key === undefined ? null : key,
        props: props || null,
        ref: ref || null,
        type: type
    };
}


function createTextVNode(text) {
    return createVNode(VNodeFlags.Text, null, null, text);
}
function isVNode(o) {
    return !!o.flags;
}

function renderComponentToString(vComponent, isRoot, context, isClass) {
    var type = vComponent.type;
    var props = vComponent.props;
    if (isClass) {
        var instance = new type(props);
        var childContext = instance.getChildContext();
        if (!isNullOrUndef(childContext)) {
            context = Object.assign({}, context, childContext);
        }
        instance.context = context;
        // Block setting state - we should render only once, using latest state
        instance._pendingSetState = true;
        instance.componentWillMount();
        var node = instance.render(props, vComponent.context);
        instance._pendingSetState = false;
        return renderVNodeToString(node, context, isRoot);
    }
    else {
        return renderVNodeToString(type(props, context), context, isRoot);
    }
}
function renderChildrenToString(children, context) {
    if (children && isArray(children)) {
        var childrenResult = [];
        var insertComment = false;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var isText = isStringOrNumber(child);
            if (isInvalid(child)) {
                childrenResult.push('<!--!-->');
            }
            else if (isText) {
                if (insertComment) {
                    childrenResult.push('<!---->');
                }
                if (isText) {
                    childrenResult.push(escapeText(child));
                }
                insertComment = true;
            }
            else if (isArray(child)) {
                childrenResult.push('<!---->');
                childrenResult.push(renderChildrenToString(child, context));
                childrenResult.push('<!--!-->');
                insertComment = true;
            }
            else if (isVNode(child)) {
                if (child.flags & VNodeFlags.Text) {
                    if (insertComment) {
                        childrenResult.push('<!---->');
                    }
                    insertComment = true;
                }
                else {
                    insertComment = false;
                }
                childrenResult.push(renderVNodeToString(child, context, false));
            }
        }
        return childrenResult.join('');
    }
    else if (!isInvalid(children)) {
        if (isStringOrNumber(children)) {
            return escapeText(children);
        }
        else {
            return renderVNodeToString(children, context, false) || '';
        }
    }
    return '';
}
function renderStyleToString(style) {
    if (isStringOrNumber(style)) {
        return style;
    }
    else {
        var styles = [];
        var keys = Object.keys(style);
        for (var i = 0; i < keys.length; i++) {
            var styleName = keys[i];
            var value = style[styleName];
            var px = isNumber(value) && !isUnitlessNumber[styleName] ? 'px' : '';
            if (!isNullOrUndef(value)) {
                styles.push(((toHyphenCase(styleName)) + ":" + (escapeAttr(value)) + px + ";"));
            }
        }
        return styles.join('');
    }
}
function renderElementToString(vNode, isRoot, context) {
    var tag = vNode.type;
    var outputProps = [];
    var props = vNode.props;
    var html = '';
    for (var prop in props) {
        var value = props[prop];
        if (prop === 'dangerouslySetInnerHTML') {
            html = value.__html;
        }
        else if (prop === 'style') {
            outputProps.push('style="' + renderStyleToString(props.style) + '"');
        }
        else if (prop === 'className') {
            outputProps.push('class="' + value + '"');
        }
        else {
            if (isStringOrNumber(value)) {
                outputProps.push(escapeAttr(prop) + '="' + escapeAttr(value) + '"');
            }
            else if (isTrue(value)) {
                outputProps.push(escapeAttr(prop));
            }
        }
    }
    if (isRoot) {
        outputProps.push('data-infernoroot');
    }
    if (isVoidElement(tag)) {
        return ("<" + tag + (outputProps.length > 0 ? ' ' + outputProps.join(' ') : '') + ">");
    }
    else {
        var content = html || renderChildrenToString(vNode.children, context);
        return ("<" + tag + (outputProps.length > 0 ? ' ' + outputProps.join(' ') : '') + ">" + content + "</" + tag + ">");
    }
}
function renderTextToString(vNode, context, isRoot) {
    return escapeText(vNode.children);
}
function renderVNodeToString(vNode, context, isRoot) {
    var flags = vNode.flags;
    if (flags & VNodeFlags.Component) {
        return renderComponentToString(vNode, isRoot, context, flags & VNodeFlags.ComponentClass);
    }
    else if (flags & VNodeFlags.Element) {
        return renderElementToString(vNode, isRoot, context);
    }
    else if (flags & VNodeFlags.Text) {
        return renderTextToString(vNode, isRoot, context);
    }
    else {
        throwError(("renderVNodeToString() expects a valid VNode, instead it received an object with the type \"" + (typeof vNode) + "\"."));
    }
}
function renderToString(input) {
    return renderVNodeToString(input, null, true);
}
function renderToStaticMarkup(input) {
    return renderVNodeToString(input, null, false);
}

function renderStyleToString$1(style) {
    if (isStringOrNumber(style)) {
        return style;
    }
    else {
        var styles = [];
        var keys = Object.keys(style);
        for (var i = 0; i < keys.length; i++) {
            var styleName = keys[i];
            var value = style[styleName];
            var px = isNumber(value) && !isUnitlessNumber[styleName] ? 'px' : '';
            if (!isNullOrUndef(value)) {
                styles.push(((toHyphenCase(styleName)) + ":" + (escapeAttr(value)) + px + ";"));
            }
        }
        return styles.join();
    }
}
function renderAttributes(props) {
    var outputAttrs = [];
    var propsKeys = (props && Object.keys(props)) || [];
    propsKeys.forEach(function (propKey, i) {
        var value = props[propKey];
        switch (propKey) {
            case 'dangerouslySetInnerHTML':
            case 'className':
            case 'style':
                return;
            default:
                if (isStringOrNumber(value)) {
                    outputAttrs.push(escapeAttr(propKey) + '="' + escapeAttr(value) + '"');
                }
                else if (isTrue(value)) {
                    outputAttrs.push(escapeAttr(propKey));
                }
        }
    });
    return outputAttrs;
}

var RenderStream = (function (Readable$$1) {
    function RenderStream(initNode, staticMarkup) {
        Readable$$1.call(this);
        this.started = false;
        this.initNode = initNode;
        this.staticMarkup = staticMarkup;
    }

    if ( Readable$$1 ) RenderStream.__proto__ = Readable$$1;
    RenderStream.prototype = Object.create( Readable$$1 && Readable$$1.prototype );
    RenderStream.prototype.constructor = RenderStream;
    RenderStream.prototype._read = function _read () {
        var this$1 = this;

        if (this.started) {
            return;
        }
        this.started = true;
        Promise.resolve().then(function () {
            return this$1.renderNode(this$1.initNode, null, this$1.staticMarkup);
        }).then(function () {
            this$1.push(null);
        }).catch(function (err) {
            this$1.emit('error', err);
        });
    };
    RenderStream.prototype.renderNode = function renderNode (vNode, context, isRoot) {
        if (isInvalid(vNode)) {
            return;
        }
        else {
            var flags = vNode.flags;
            if (flags & VNodeFlags.Component) {
                return this.renderComponent(vNode, isRoot, context, flags & VNodeFlags.ComponentClass);
            }
            else if (flags & VNodeFlags.Element) {
                return this.renderElement(vNode, isRoot, context);
            }
            else {
                return this.renderText(vNode, isRoot, context);
            }
        }
    };
    RenderStream.prototype.renderComponent = function renderComponent (vComponent, isRoot, context, isClass) {
        var this$1 = this;

        var type = vComponent.type;
        var props = vComponent.props;
        if (!isClass) {
            return this.renderNode(type(props), context, isRoot);
        }
        var instance = new type(props);
        var childContext = instance.getChildContext();
        if (!isNullOrUndef(childContext)) {
            context = Object.assign({}, context, childContext);
        }
        instance.context = context;
        // Block setting state - we should render only once, using latest state
        instance._pendingSetState = true;
        return Promise.resolve(instance.componentWillMount()).then(function () {
            var node = instance.render();
            instance._pendingSetState = false;
            return this$1.renderNode(node, context, isRoot);
        });
    };
    RenderStream.prototype.renderChildren = function renderChildren (children, context) {
        var this$1 = this;

        if (isStringOrNumber(children)) {
            return this.push(escapeText(children));
        }
        if (!children) {
            return;
        }
        var childrenIsArray = isArray(children);
        if (!childrenIsArray && !isInvalid(children)) {
            return this.renderNode(children, context, false);
        }
        if (!childrenIsArray) {
            throw new Error('invalid component');
        }
        return children.reduce(function (p, child) {
            return p.then(function (insertComment) {
                var isText = isStringOrNumber(child);
                var childIsInvalid = isInvalid(child);
                if (isText || childIsInvalid) {
                    if (insertComment === true) {
                        if (childIsInvalid) {
                            this$1.push('<!--!-->');
                        }
                        else {
                            this$1.push('<!---->');
                        }
                    }
                    if (isText) {
                        this$1.push(escapeText(child));
                    }
                    return true;
                }
                else if (isArray(child)) {
                    this$1.push('<!---->');
                    return Promise.resolve(this$1.renderChildren(child)).then(function () {
                        this$1.push('<!--!-->');
                        return true;
                    });
                }
                else {
                    if (child.flags & VNodeFlags.Text) {
                        if (insertComment) {
                            this$1.push('<!---->');
                        }
                        
                        insertComment = true;
                    }
                    return this$1.renderNode(child, context, false)
                        .then(function (insertComment) {
                        if (child.flags & VNodeFlags.Text) {
                            return true;
                        }
                        return false;
                    });
                }
            });
        }, Promise.resolve(false));
    };
    RenderStream.prototype.renderText = function renderText (vNode, isRoot, context) {
        var this$1 = this;

        return Promise.resolve().then(function (insertComment) {
            this$1.push(vNode.children);
            return insertComment;
        });
    };
    RenderStream.prototype.renderElement = function renderElement (vElement, isRoot, context) {
        var this$1 = this;

        var tag = vElement.type;
        var props = vElement.props;
        var outputAttrs = renderAttributes(props);
        var html = '';
        if (props) {
            var className = props.className;
            if (className) {
                outputAttrs.push('class="' + escapeAttr(className) + '"');
            }
            var style = props.style;
            if (style) {
                outputAttrs.push('style="' + renderStyleToString$1(style) + '"');
            }
            if (props.dangerouslySetInnerHTML) {
                html = props.dangerouslySetInnerHTML.__html;
            }
        }
        if (isRoot) {
            outputAttrs.push('data-infernoroot');
        }
        this.push(("<" + tag + (outputAttrs.length > 0 ? ' ' + outputAttrs.join(' ') : '') + ">"));
        if (isVoidElement(tag)) {
            return;
        }
        if (html) {
            this.push(html);
            this.push(("</" + tag + ">"));
            return;
        }
        return Promise.resolve(this.renderChildren(vElement.children, context)).then(function () {
            this$1.push(("</" + tag + ">"));
        });
    };

    return RenderStream;
}(stream.Readable));
function streamAsString(node) {
    return new RenderStream(node, false);
}
function streamAsStaticMarkup(node) {
    return new RenderStream(node, true);
}

var index = {
	renderToString: renderToString,
	renderToStaticMarkup: renderToStaticMarkup,
	streamAsString: streamAsString,
	streamAsStaticMarkup: streamAsStaticMarkup,
	RenderStream: RenderStream
};

return index;

})));
