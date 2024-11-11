/** @typedef {import("../constants.js").ATTRIBUTE_NODE} ATTRIBUTE_NODE */
/** @typedef {import("../constants.js").COMMENT_NODE} COMMENT_NODE */
/** @typedef {import("../constants.js").ELEMENT_NODE} ELEMENT_NODE */
/** @typedef {AttributePath | CommentPath | TextPath} AnyPath */
/** @typedef {import("./key-value.js").AttributeDetails} AttributeDetails */
/** @typedef {Path<ATTRIBUTE_NODE, number[], AttributeDetails>} AttributePath */
/** @typedef {import("./key-value.js").CommentDetails} CommentDetails */
/** @typedef {Path<COMMENT_NODE, number[], CommentDetails>} CommentPath */
/** @typedef {Path<ELEMENT_NODE, number[], null>} TextPath */
/** @template T,P,E */
export default class Path<T, P, E> {
    /**
     * @param {T} type
     * @param {P} path
     * @param {E} extra
     */
    constructor(type: T, path: P, extra: E);
    type: T;
    path: P;
    extra: E;
}
export type ATTRIBUTE_NODE = 2;
export type COMMENT_NODE = 8;
export type ELEMENT_NODE = 1;
export type AnyPath = AttributePath | CommentPath | TextPath;
export type AttributeDetails = import("./key-value.js").AttributeDetails;
export type AttributePath = Path<ATTRIBUTE_NODE, number[], AttributeDetails>;
export type CommentDetails = import("./key-value.js").CommentDetails;
export type CommentPath = Path<COMMENT_NODE, number[], CommentDetails>;
export type TextPath = Path<ELEMENT_NODE, number[], null>;
