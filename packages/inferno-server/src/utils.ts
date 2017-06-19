/**
 * @module Inferno-Server
 */ /** TypeDoc Comment */

const ecapeCharacters = {
    '"': '&quot;',
    '&': '&amp;',
    '\'': '&#039;',
    '<': '&lt;',
    '>': '&gt;'
  };
const escapeChar = (char) => ecapeCharacters[ char ] || char;

export function escapeText(text) {
  return String(text).replace(/[<>"'&]/g, escapeChar);
}

const uppercasePattern = /[A-Z]/g;
const msPattern = /^ms-/;

export function toHyphenCase(str) {
  return str.replace(uppercasePattern, '-$&').toLowerCase().replace(msPattern, '-ms-');
}

const voidElements: Set<string> = new Set();

voidElements.add('area');
voidElements.add('base');
voidElements.add('br');
voidElements.add('col');
voidElements.add('command');
voidElements.add('embed');
voidElements.add('hr');
voidElements.add('img');
voidElements.add('input');
voidElements.add('keygen');
voidElements.add('link');
voidElements.add('meta');
voidElements.add('param');
voidElements.add('source');
voidElements.add('track');
voidElements.add('wbr');

export function isVoidElement(str) {
  return voidElements.has(str);
}
