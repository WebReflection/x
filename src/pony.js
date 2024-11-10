
// ⚠️ AUTOMATICALLY GENERATED - DO NOT MODIFY
export default document => {
  const { constructor: DocumentFragment } = document.createDocumentFragment();

  const ELEMENT_NODE = 1;
  const ATTRIBUTE_NODE = 2;
  const COMMENT_NODE = 8;
  const DOCUMENT_FRAGMENT_NODE = 11;
  
  const TEXT_ELEMENTS = /^(?:plaintext|script|style|textarea|title|xmp)$/i;
  const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
  
  const ANY = 1;
  const ARRAY = 2;
  const HOLE = 3;
  const OBJECT = 4;
  
  class Hole {
    /**
     * @param {import("../types.js").Node} node
     * @param {unknown[]} values
     */
    constructor(node, values) {
      this.k = node;
      this.v = values;
    }
  }
  
  var freeze = Object.freeze;
  
  var empty = freeze([]);
  
  const { isArray } = Array;
  const isObject = value => value != null && typeof value === 'object';
  
  const attribute = Symbol();
  
  const direct = Map => class extends Map {
    set(key, value) {
      super.set(key, value);
      return value;
    }
  };
  
  const { keys } = Object;
  
  const abc = (a, b, c) => ({ a, b, c });
  const kv = (k, v) => ({ k, v });
  
  const info = (update) => ({ update });
  
  /**
   * @typedef {Object} ReplaceChildren
   * @prop {(node:Node) => void} replaceChildren
   */
  
  /**
   * @param {Stack} stack
   * @param {import("../types.js").Hole} hole
   * @returns {{ k: boolean, v: import("../types.js").GenericNode] }}
   */
  const diff$3 = (stack, { k, v }) => kv(stack.as(k), stack.get(v));
  
  /**
   * @param {Stack[]} cache
   * @param {import("../types.js").Hole[]} holes
   */
  const array$1 = (cache, holes) => {
    const { length } = holes;
    if (length < cache.length)
      cache.splice(length);
    for (let i = 0; i < length; i++) {
      const { v: node } = diff$3(
        cache[i] || (cache[i] = new Stack),
        holes[i]
      );
      holes[i] = node;
    }
  };
  
  const entries$1 = ({ k, v }) => abc(k, v, v === HOLE ? new Stack : []);
  
  class Stack {
    static diff = diff$3;
  
    /** @type {import("../types.js").Node | import("../types.js").Keyed | null} */
    node = null;
    /** @type {{ update: (values: unknown[]) => GenericNode }?} */
    value = null;
    /** @type {[number, number, Stack | Stack[]][]} */
    cache = empty;
  
    /**
     * @param {import("../types.js").Hole} hole
     * @returns {boolean}
     */
    as(node) {
      if (this.node !== node) {
        const { holes } = node;
        this.node = node;
        this.value = node.create(false);
        this.cache = holes.length ? holes.map(entries$1) : empty;
        return true;
      }
      return false;
    }
  
    /**
     * @param {import("../types.js").Hole} hole
     * @returns {import("../types.js").GenericNode}
     */
    get(values) {
      for (const { a: i, b: type, c: ref } of this.cache) {
        if (type === ARRAY)
          array$1(ref, values[i]);
        else {
          const { k: different, v: node } = diff$3(ref, values[i]);
          values[i] = different ? node.valueOf() : node;
        }
      }
      return this.value.update(values);
    }
  }
  
  const elements = /<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g;
  const attributes = /([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g;
  const holes = /[\x01\x02]/g;
  
  // \x01 Node.ELEMENT_NODE
  // \x02 Node.ATTRIBUTE_NODE
  
  /**
   * Given a template, find holes as both nodes and attributes and
   * return a string with holes as either comment nodes or named attributes.
   * @param {string[]} template a template literal tag array
   * @param {string} prefix prefix to use per each comment/attribute
   * @param {boolean} xml enforces self-closing tags
   * @returns {string} X/HTML with prefixed comments or attributes
   */
  var parser$1 = (template, prefix, xml) => {
    let i = 0;
    return template
      .join('\x01')
      .trim()
      .replace(
        elements,
        (_, name, attrs, selfClosing) => `<${
            name
          }${
            attrs.replace(attributes, '\x02=$2$1').trimEnd()
          }${
            selfClosing ? (
              (xml || VOID_ELEMENTS.test(name)) ? ' /' : `></${name}`
            ) : ''
          }>`
      )
      .replace(
        holes,
        hole => hole === '\x01' ? `<!--${prefix + i++}-->` : (prefix + i++)
      )
    ;
  };
  
  const {setPrototypeOf} = Object;
  
  /**
   * @param {Function} Class any base class to extend without passing through it via super() call.
   * @returns {Function} an extensible class for the passed one.
   * @example
   *  // creating this very same module utility
   *  import custom from 'custom-function/factory';
   *  const CustomFunction = custom(Function);
   *  class MyFunction extends CustomFunction {}
   *  const mf = new MyFunction(() => {});
   */
  var native = Class => {
    function Custom(target) {
      return setPrototypeOf(target, new.target.prototype);
    }
    Custom.prototype = Class.prototype;
    return Custom;
  };
  
  let active = false;
  
  /** @extends {DocumentFragment} for real! */
  class Fragment extends native(DocumentFragment) {
    // u/domdiff helper
    static diff = (node, op) => active && node instanceof Fragment ?
      ((1 / op) < 0 ?
        (op ? /* remove */ node.#remove(true) : /* after */ node.#lastChild) :
        (op ? /* insert */ node.valueOf() : /* before */ node.#firstChild)) :
      node
    ;
  
    // privates
    #firstChild;  // the virtual firstChild as reference
    #lastChild;   // the virtual lastChild as reference
  
    /**
     * Drop known nodes from their parents and optionally keep its lastChild in there
     * @param {boolean} keepLast
     * @returns {ChildNode | void}
     */
    #remove(keepLast) {
      let { childNodes } = this, lastChild;
      if (keepLast) lastChild = childNodes.pop();
      super.replaceChildren(...childNodes);
      return lastChild;
    }
  
    // public utilities and accessors
    /** @param {DocumentFragment} fragment */
    constructor(fragment) {
      super(fragment);
      const firstChild = super.firstChild;
      // empty html`` fragment or array as first node html`${[]}!`
      this.#firstChild = !firstChild || firstChild.nodeType === COMMENT_NODE ?
        super.insertBefore(document.createComment('<>'), firstChild) :
        firstChild;
      this.#lastChild = super.lastChild;
      active = true;
    }
  
    get firstChild() { return this.#firstChild; }
    get lastChild() { return this.#lastChild; }
    get parentNode() { return this.#lastChild.parentNode; }
  
    get childNodes() {
      let firstChild = this.#firstChild, i = 0;
      const childNodes = [firstChild], lastChild = this.#lastChild;
      while (firstChild != lastChild) {
        firstChild = firstChild.nextSibling;
        childNodes[i++] = firstChild;
      }
      return childNodes;
    }
  
    remove() { this.#remove(false); }
  
    /** @param {Node} node */
    replaceWith(node) {
      const last = this.#remove(true);
      const child = this.#lastChild;
      // conflict with u/domdiff remove(true)
      if (last !== child) super.appendChild(last);
      // let it throw if child wasn't even connected
      child.replaceWith(node);
    }
  
    valueOf() {
      const { parentNode } = this.#lastChild;
      // fragment is not even connected
      if (!parentNode) super.appendChild(this.#lastChild);
      // fragment is being moved/appended elsewhere
      else if (parentNode !== this) super.replaceChildren(...this.childNodes);
      return this;
    }
  }
  
  class Node {
    /**
     * @param {import("../types.js").GenericNode} node
     * @param {import("../types.js").Path[]} paths
     */
    constructor(node, paths, holes, update) {
      this.type = node.nodeType;
      this.node = node;
      this.paths = paths;
      this.holes = holes;
      this.update = update;
    }
  
    /**
     * @param {import("../types.js").Update} update
     * @param {boolean} once
     * @returns
     */
    create(once) {
      const { type, node, paths, update } = this;
      const { length } = paths;
      const updates = length ? [] : empty;
      let dom = document.importNode(node, true);
      for (let prevPath = empty, node = dom, i = 0; i < length; i++) {
        const { a: type, b: path, c: extra } = paths[i];
        // speed up multiple attributes per same node
        if (prevPath !== path) {
          prevPath = path;
          node = dom;
          for (let { length: i } = path; i--; node = node.childNodes[path[i]]);
        }
        updates[i] = update[type](node, once, extra);
      }
      if (type === DOCUMENT_FRAGMENT_NODE) dom = new Fragment(dom);
      return info(
        values => {
          for (let i = 0; i < length; i++) updates[i](values[i]);
          return dom;
        }
      );
    }
  }
  
  const fr = new FinalizationRegistry(([map, value]) => { map.delete(value); });
  
  class Keyed extends Node {
    constructor(node, paths, holes, update, key) {
      super(node, paths, holes, update);
      this.key = key;
      this.map = new Map;
    }
    /**
     * @param {import("../types.js").Update} update
     * @param {boolean} once
     * @returns {{update: (values: unknown[]) => GenericNode}}
     */
    create(once) {
      const { key, map } = this;
      const wrap = info(
        values => {
          const value = values[key];
          let info = map.get(value);
          if (!info) {
            info = super.create(once);
            map.set(value, info);
            fr.register(wrap, [map, value]);
          }
          return info.update(values);
        }
      );
      return wrap;
    }
  }
  
  const getContent = fragment => {
    const { firstChild: $, lastChild } = fragment;
    // empty html`` fragments or html`${[]}` cases
    return $ && $ === lastChild && $.nodeType !== COMMENT_NODE ?
      fragment.removeChild($) : fragment;
  };
  
  let template = document.createElement('template');
  
  /** @type {(text:string) => DocumentFragment | HTMLElement | Node} */
  const html$1 = text => {
    template.innerHTML = text;
    const { content } = template;
    const node = getContent(content);
    if (node === content) template = template.cloneNode(false);
    return node;
  };
  
  let range;
  
  /** @type {(text:string) => DocumentFragment | SVGElement | Node} */
  const svg$1 = text => {
    if (!range) {
      range = document.createRange();
      range.selectNodeContents(
        document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      );
    }
    return getContent(range.createContextualFragment(text));
  };
  
  const { indexOf } = empty;
  
  /**
   * @param {Node} node
   * @returns {number[]}
   */
  const map = node => {
    const path = [];
    let i = 0, parentNode;
    while ((parentNode = node.parentNode)) {
      path[i++] = indexOf.call(parentNode.childNodes, node);
      node = parentNode;
    }
    return i ? path : empty;
  };
  
  const keyValue = ['key', ''];
  const prefix = 'isµ';
  
  /**
   * @param {boolean} SVG indicate SVG parser VS an HTML one
   * @returns {(template:TemplateStringsArray|string[]) => import("./types.js").Node | import("./types.js").Keyed}
   */
  var parser = SVG => {
    const content = SVG ? svg$1 : html$1;
    return (template, values, attr, update) => {
      const text = parser$1(template, prefix, SVG);
      const node = content(text);
      const length = template.length - 1;
      const paths = [], holes = [], comments = [];
      // TODO: the only thing I am not convinced is that
      // a TreeWalker is any better or faster for the task
      const tw = document.createTreeWalker(node, 1 | 128);
      let key = -1, i = 0;
      while (i < length) {
        const { currentNode } = tw;
        switch (currentNode.nodeType) {
          case COMMENT_NODE: {
            // holes
            if (currentNode.data === (prefix + i)) {
              const value = values[i];
              const extra = isObject(value) ?
                (value instanceof Hole ?
                  HOLE : (isArray(value) ? ARRAY : OBJECT)) :
                ANY
              ;
              if (extra === ANY) comments.push(currentNode);
              // TODO: objects as holes is currently not supported
              else if (extra !== OBJECT) holes.push(kv(i, extra));
              i = paths.push(abc(COMMENT_NODE, map(currentNode), extra));
            }
            break;
          }
          case ELEMENT_NODE: {
            let path, search;
            // attributes
            while (currentNode.hasAttribute((search = prefix + i))) {
              const name = currentNode.getAttribute(search);
              let extra = keyValue;
              if (name === 'key') key = i;
              else {
                const c = name[0];
                const k = attr.has(c) ? c : (attr.has(name) ? name : attribute);
                extra = [k, c === k ? name.slice(1) : name];
              }
              path ??= map(currentNode);
              currentNode.removeAttribute(search);
              i = paths.push(abc(ATTRIBUTE_NODE, path, extra));
            }
            // text only elements:
            // plaintext, script, style, textarea, title, xmp
            if (
              !SVG &&
              TEXT_ELEMENTS.test(currentNode.localName) &&
              currentNode.textContent.trim() === `<!--${search}-->`
            ) {
              i = paths.push(abc(ELEMENT_NODE, path || map(currentNode), null));
            }
            break;
          }
        }
        tw.nextNode();
      }
  
      for (const comment of comments)
        comment.replaceWith(document.createTextNode(''));
  
      const Class = key < 0 ? Node : Keyed;
      return new Class(
        node,
        i ? paths : empty,
        holes.length ? holes : empty,
        update,
        key
      );
    };
  };
  
  const DirectWeakMap = direct(WeakMap);
  
  const dwm = new DirectWeakMap;
  const { diff: diff$2 } = Stack;
  
  /**
   * @param {import("./types.js").Node} node
   * @param {unknown[]} values
   * @returns {import("./types.js").ParsedNode}
   */
  const once = (node, values) => node.create(true).update(values);
  
  /**
   * @param {import("./types.js").Node} node
   * @param {unknown[]} values
   * @returns {import("./types.js").Hole}
   */
  const many = (node, values) => new Hole(node, values);
  
  let resolve = once;
  
  /**
   * @param {ParentNode} where
   * @param {() => import("./types.js").Hole} what
   * @returns {ParentNode}
   */
  const render = (where, what) => {
    const resolver = resolve;
    resolve = many;
    const { k: different, v: node } = diff$2(
      dwm.get(where) || dwm.set(where, new Stack),
      what()
    );
    if (different) where.replaceChildren(node.valueOf());
    resolve = resolver;
    return where;
  };
  
  /**
   * @param {boolean} SVG
   * @param {unknown} attr
   * @param {unknown} diff
   * @returns {(template:TemplateStringsArray | string[], ...interpolations:unknown) => import("./types.js").ParsedNode | import("./types.js").Hole}
   */
  const tag = (SVG, attr, diff, text) => {
    const attributes = new Set(keys(attr));
    const dwm = new DirectWeakMap;
    const parse = parser(SVG);
    const update = {
      [ATTRIBUTE_NODE]: (node, once, [k, v]) => attr[k](node, v, once, SVG),
      [COMMENT_NODE]: (node, once, hint) => diff(node, hint, once, SVG),
      [ELEMENT_NODE]: text,
    };
    return (t, ...v) => resolve(
      dwm.get(t) || dwm.set(t, parse(t, v, attributes, update)),
      v,
    )
  };
  
  const { entries } = Object;
  
  const key = () => key;
  
  /**
   * @param {unknown | unknown[]} value
   * @returns {unknown[]}
   */
  const args = value => isArray(value) ? value : [value];
  
  /**
   * @param {Element} node
   * @param {string} type
   * @param {unknown[]} prev
   * @returns {(value:unknown | unknown[]) => void}
   */
  const handleListener = (node, type, prev) => value => {
    const curr = args(value);
    if (curr[0] != prev[0]) {
      if (prev[0]) node.removeEventListener(type, ...prev);
      if (curr[0]) node.addEventListener(type, ...curr);
      prev = curr;
    }
  };
  
  /**
   * Set or remove an attribute
   * @param {Element} node
   * @param {string} name
   * @param {unknown} value
   */
  const setAttribute = (node, name, value) => {
    if (value == null) node.removeAttribute(name);
    else node.setAttribute(name, value);
  };
  
  /**
   * Directly set an element property as value
   * @param {Element} node
   * @param {string} prop
   * @param {unknown} value
   */
  const setProperty = (node, prop, value) => {
    node[prop] = value;
  };
  
  /**
   * @template {Function} T
   * @param {T} callback
   * @param {Element} node
   * @param {string} name
   * @param {unknown} prev
   * @returns {(value:unknown) => void}
   */
  const storeValueFor = (callback, node, name, prev) => curr => {
    if (prev != curr) callback(node, name, (prev = curr));
  };
  
  /**
   * Toggle an element attribute
   * @param {Element} node
   * @param {string} name
   * @param {boolean} value
   */
  const toggleAttribute = (node, name, value) => {
    node.toggleAttribute(name, value);
  };
  
  const noListener = [null];
  
  var attr = {
    __proto__: null,
    // DEFAULT ATTRIBUTE HANDLER
    /**
     * @param {Element} node
     * @param {string} name
     * @param {boolean} once
     * @returns
     */
    [attribute]: (node, name, once) => once ?
      value => setAttribute(node, name, value) :
      storeValueFor(setAttribute, node, name, null)
    ,
    // SINGLE CHAR SHORTCUTS
    /**
     * Events listeners
     * @param {Element} node
     * @param {string} type
     * @param {boolean} once
     * @returns
     */
    ['@']: (node, type, once) => once ?
      value => node.addEventListener(type, ...args(value)) :
      handleListener(node, type, noListener)
    ,
    /**
     * Attribute toggle
     * @param {Element} node
     * @param {string} name
     * @param {boolean} once
     * @returns
     */
    ['?']: (node, name, once) => once ?
      value => toggleAttribute(node, name, value) :
      storeValueFor(toggleAttribute, node, name, false)
    ,
    /**
     * Direct accessor
     * @param {Element} node
     * @param {string} prop
     * @param {boolean} once
     * @returns
     */
    ['.']: (node, prop, once) => once ?
      value => setProperty(node, prop, value) :
      storeValueFor(setProperty, node, prop, null)
    ,
    // SPECIAL KEY HANDLER
    key,
    // SPECIAL ATTRIBUTES
    /**
     * Aria attributes as object literal
     * @param {Element} node
     * @returns
     */
    aria: node => props => {
      for (let [key, value] of entries(props))
        setAttribute(node, key === 'role' ? key : `aria-${key}`, value);
    },
    /**
     * Dataset attributes as object literal
     * @param {Element} node
     * @returns
     */
    data: ({ dataset }) => props => {
      for (const [key, value] of entries(props)) {
        if (value == null) delete dataset[key];
        else dataset[key] = value;
      }
    },
  };
  
  /**
   * ISC License
   *
   * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */
  
  /**
   * @param {Node} parentNode The container where children live
   * @param {Node[]} a The list of current/live children
   * @param {Node[]} b The list of future children
   * @param {(entry: Node, action: number) => Node} get
   * The callback invoked per each entry related DOM operation.
   * @param {Node} [before] The optional node used as anchor to insert before.
   * @returns {Node[]} The same list of future children.
   */
  var udomdiff = (parentNode, a, b, get, before) => {
    const bLength = b.length;
    let aEnd = a.length;
    let bEnd = bLength;
    let aStart = 0;
    let bStart = 0;
    let map = null;
    while (aStart < aEnd || bStart < bEnd) {
      // append head, tail, or nodes in between: fast path
      if (aEnd === aStart) {
        // we could be in a situation where the rest of nodes that
        // need to be added are not at the end, and in such case
        // the node to `insertBefore`, if the index is more than 0
        // must be retrieved, otherwise it's gonna be the first item.
        const node = bEnd < bLength ?
          (bStart ?
            (get(b[bStart - 1], -0).nextSibling) :
            get(b[bEnd - bStart], 0)) :
          before;
        while (bStart < bEnd)
          parentNode.insertBefore(get(b[bStart++], 1), node);
      }
      // remove head or tail: fast path
      else if (bEnd === bStart) {
        while (aStart < aEnd) {
          // remove the node only if it's unknown or not live
          if (!map || !map.has(a[aStart]))
            parentNode.removeChild(get(a[aStart], -1));
          aStart++;
        }
      }
      // same node: fast path
      else if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
      }
      // same tail: fast path
      else if (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      // The once here single last swap "fast path" has been removed in v1.1.0
      // https://github.com/WebReflection/udomdiff/blob/single-final-swap/esm/index.js#L69-L85
      // reverse swap: also fast path
      else if (
        a[aStart] === b[bEnd - 1] &&
        b[bStart] === a[aEnd - 1]
      ) {
        // this is a "shrink" operation that could happen in these cases:
        // [1, 2, 3, 4, 5]
        // [1, 4, 3, 2, 5]
        // or asymmetric too
        // [1, 2, 3, 4, 5]
        // [1, 2, 3, 5, 6, 4]
        const node = get(a[--aEnd], -1).nextSibling;
        parentNode.insertBefore(
          get(b[bStart++], 1),
          get(a[aStart++], -1).nextSibling
        );
        parentNode.insertBefore(get(b[--bEnd], 1), node);
        // mark the future index as identical (yeah, it's dirty, but cheap 👍)
        // The main reason to do this, is that when a[aEnd] will be reached,
        // the loop will likely be on the fast path, as identical to b[bEnd].
        // In the best case scenario, the next loop will skip the tail,
        // but in the worst one, this node will be considered as already
        // processed, bailing out pretty quickly from the map index check
        a[aEnd] = b[bEnd];
      }
      // map based fallback, "slow" path
      else {
        // the map requires an O(bEnd - bStart) operation once
        // to store all future nodes indexes for later purposes.
        // In the worst case scenario, this is a full O(N) cost,
        // and such scenario happens at least when all nodes are different,
        // but also if both first and last items of the lists are different
        if (!map) {
          map = new Map;
          let i = bStart;
          while (i < bEnd)
            map.set(b[i], i++);
        }
        // if it's a future node, hence it needs some handling
        if (map.has(a[aStart])) {
          // grab the index of such node, 'cause it might have been processed
          const index = map.get(a[aStart]);
          // if it's not already processed, look on demand for the next LCS
          if (bStart < index && index < bEnd) {
            let i = aStart;
            // counts the amount of nodes that are the same in the future
            let sequence = 1;
            while (++i < aEnd && i < bEnd && map.get(a[i]) === (index + sequence))
              sequence++;
            // effort decision here: if the sequence is longer than replaces
            // needed to reach such sequence, which would brings again this loop
            // to the fast path, prepend the difference before a sequence,
            // and move only the future list index forward, so that aStart
            // and bStart will be aligned again, hence on the fast path.
            // An example considering aStart and bStart are both 0:
            // a: [1, 2, 3, 4]
            // b: [7, 1, 2, 3, 6]
            // this would place 7 before 1 and, from that time on, 1, 2, and 3
            // will be processed at zero cost
            if (sequence > (index - bStart)) {
              const node = get(a[aStart], 0);
              while (bStart < index)
                parentNode.insertBefore(get(b[bStart++], 1), node);
            }
            // if the effort wasn't good enough, fallback to a replace,
            // moving both source and target indexes forward, hoping that some
            // similar node will be found later on, to go back to the fast path
            else {
              parentNode.replaceChild(
                get(b[bStart++], 1),
                get(a[aStart++], -1)
              );
            }
          }
          // otherwise move the source forward, 'cause there's nothing to do
          else
            aStart++;
        }
        // this node has no meaning in the future list, so it's more than safe
        // to remove it, and check the next live node out instead, meaning
        // that only the live list index should be forwarded
        else
          parentNode.removeChild(get(a[aStart++], -1));
      }
    }
    return b;
  };
  
  const any = (node, prev) => curr => {
    if (prev !== curr) {
      prev = curr;
      node.data = curr ?? '';
    }
  };
  
  const { diff } = Fragment;
  const array = (node, prev) => curr => {
    prev = udomdiff(
      node.parentNode,
      prev,
      curr.length ? curr : empty,
      diff,
      node
    );
  };
  
  const object = prev => curr => {
    if (prev !== curr) {
      prev.replaceWith(curr.valueOf());
      prev = curr;
    }
  };
  
  const multi$1 = (node, hint) => {
    if (hint === ARRAY) return array(node, empty);
    if (hint === ANY) return any(node, '');
    return object(node);
  };
  
  const oneOff$1 = (node, hint) => value => {
    if (hint === ARRAY) {
      array(node, empty)(value);
      node.remove();
    }
    else if (hint === ANY) any(node, '')(value);
    else object(node)(value);
  };
  
  var diff$1 = (node, hint, once) => (once ? oneOff$1 : multi$1)(node, hint);
  
  const setContent = (node, content) => {
    node.textContent = content ?? '';
  };
  
  const multi = (node, prev) => curr => {
    if (prev != curr) {
      prev = curr;
      setContent(node, curr);
    }
  };
  
  const oneOff = node => value => setContent(node, value);
  
  var text = (node, once) => (once ? oneOff : multi)(node);
  
  const html = tag(false, attr, diff$1, text);
  const svg = tag(true, attr, diff$1, text);
  
  // return const component = callback => (...args) => () => callback(...args);
  
  export { html, render, svg };
};
