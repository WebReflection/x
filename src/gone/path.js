// @ts-check

/** @typedef {import("../constants.js").ATTRIBUTE_NODE} ATTRIBUTE_NODE */
/** @typedef {import("../constants.js").COMMENT_NODE} COMMENT_NODE */
/** @typedef {import("../constants.js").ELEMENT_NODE} ELEMENT_NODE */

/** @typedef {AttributePath | CommentPath | TextPath} AnyPath */
/** @typedef {import("./key-value.js").AttributeDetails} AttributeDetails */
/** @typedef {Path<ATTRIBUTE_NODE, AttributeDetails>} AttributePath */
/** @typedef {import("./key-value.js").CommentDetails} CommentDetails */
/** @typedef {Path<COMMENT_NODE, CommentDetails>} CommentPath */
/** @typedef {Path<ELEMENT_NODE, null>} TextPath */

/** @template T,E */
export default class Path {
  /**
   * @param {T} type
   * @param {number[]} path
   * @param {E?} extra
   */
  constructor(type, path, extra) {
    this.type = type;
    this.path = path;
    this.extra = extra;
  }
}
