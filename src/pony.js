
// ⚠️ AUTOMATICALLY GENERATED - DO NOT MODIFY
export default document => {
  const { constructor: DocumentFragment } = document.createDocumentFragment();

  const ELEMENT_NODE = 1;
  const ATTRIBUTE_NODE = 2;
  const COMMENT_NODE = 8;
  const DOCUMENT_FRAGMENT_NODE = 11;
  
  var freeze = Object.freeze;
  
  var empty$1 = freeze([]);
  
  class Hole {
    constructor(node, update, values) {
      this.node = node;
      this.update = update;
      this.values = values;
    }
  }
  
  class Live {
    /**
     * @param {import("../types.js").Node} node
     * @param {import("../types.js").Update} update
     */
    constructor(node, update) {
      this.node = node;
      this.info = node.create(update, false);
    }
  
    /**
     * @param {unknown[]} values
     * @returns {import("../types.js").ParsedNode}
     */
    update(values) {
      return this.info.update(values);
    }
  }
  
  const { isArray } = Array;
  const attribute = Symbol();
  
  const isObject = value => value && typeof value === 'object';
  
  const direct = Map => class extends Map {
    set(key, value) {
      super.set(key, value);
      return value;
    }
  };
  
  const key$1 = () => key$1;
  
  const setAttribute = (node, name, value) => {
    if (value == null) node.removeAttribute(name);
    else node.setAttribute(name, value);
  };
  
  const toggleAttribute = (node, name, value) => {
    node.toggleAttribute(name, value);
  };
  
  const setProperty = (node, prop, value) => {
    node[prop] = value;
  };
  
  const empty = [null];
  const handleListener = (node, type) => {
    let prev = empty;
    return value => {
      const curr = value ? (isArray(value) ? value : [value]) : empty;
      const different = curr[0] != prev[0];
      if (different && prev[0])
        node.removeEventListener(type, ...prev);
      if (different)
        node.addEventListener(type, ...curr);
      prev = curr;
    };
  };
  
  const STACK = 0;
  const ANY = 1;
  const ARRAY = 2;
  const HOLE = 3;
  const OBJECT = 4;
  
  const type = value => {
    if (isObject(value)) {
      if (value instanceof Hole) return HOLE;
      if (isArray(value)) return ARRAY;
      return OBJECT;
    }
    return ANY;
  };
  
  const unroll = (values, cache) => {
    const { length } = values;
    for (let i = 0; i < length; i++) {
      const curr = values[i];
      const prev = cache[i] || (cache[i] = new Stack(type(curr)));
      switch (prev.type) {
        case HOLE: {
          const replaceChildren = prev.as(curr);
          const value = prev.value.update(unroll(curr.values, prev.cache));
          values[i] = replaceChildren ? value.valueOf() : value;
          break;
        }
        case ARRAY: {
          if (prev.value === null && curr.length) {
            const value = type(curr[0]) === HOLE ? HOLE : ANY;
            prev.value = value;
            if (value === HOLE) prev.cache = [];
          }
          if (prev.value === HOLE)
            values[i] = unroll(curr, prev.cache);
          break;
        }
        case OBJECT: {
          if (prev.value !== curr) {
            prev.value = curr;
            values[i] = curr.valueOf();
          }
          break;
        }
      }
    }
    if (length < cache.length) cache.splice(length);
    return values;
  };
  
  class Stack {
    /**
     * @param {0 | 1 | 2 | 3 | 4} type
     */
    constructor(type = STACK) {
      /** @type {0 | 1 | 2 | 3 | 4} */
      this.type = type;
      /** @type {unknown} */
      this.value = null;
      /** @type {unknown[]} */
      this.cache = empty$1;
    }
    parse(node, update, values) {
      return new Hole(node, update, values);
    }
    as({ node, update, values }) {
      if (this.value?.node !== node) {
        this.value = new Live(node, update);
        this.cache = values.length ? [] : empty$1;
        return true;
      }
      return false;
    }
    update(where, what) {
      const replaceChildren = this.as(what);
      const value = this.value.update(unroll(what.values, this.cache));
      if (replaceChildren) where.replaceChildren(value.valueOf());
    }
  }
  
  const TEXT_ELEMENTS = /^(?:plaintext|script|style|textarea|title|xmp)$/i;
  const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
  
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
  
  /** @extends {DocumentFragment} for real! */
  class Fragment extends native(DocumentFragment) {
    // static u/domdiff utility
    static diff(node, op) {
      return node instanceof Fragment ?
        ((1 / op) < 0 ?
          (op ? /* remove */ node.#remove(true) : /* after */ node.#lastChild) :
          (op ? /* insert */ node.valueOf() : /* before */ node.#firstChild)) :
        node;
    }
  
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
    }
  
    get firstChild() { return this.#firstChild; }
    get lastChild() { return this.#lastChild; }
    get parentNode() { return this.#lastChild.parentNode; }
  
    get childNodes() {
      let firstChild = this.#firstChild;
      const childNodes = [firstChild], lastChild = this.#lastChild;
      while (firstChild != lastChild)
        childNodes.push(firstChild = firstChild.nextSibling);
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
  
  class Info {
    /**
     * @param {import("./node.js").Node} node
     * @param {((value:unknown) => void)[]} updates
     */
    constructor(node, updates) {
      this.node = node;
      this.updates = updates;
    }
  
    /**
     * @param {unknown[]} values
     * @returns {this}
     */
    update(values) {
      const { updates } = this;
      for (let { length } = updates, i = 0; i < length; i++)
        updates[i](values[i]);
      return this.node;
    }
  }
  
  class Node {
    /**
     * @param {1 | 3 | 8 | 11} type
     * @param {Element | Text | Comment | DocumentFragment} node
     * @param {import("../types.js").Path[]} paths
     */
    constructor(type, node, paths) {
      this.type = type;
      this.node = node;
      this.paths = paths;
    }
  
    /**
     * @param {import("../types.js").Update} update
     * @param {boolean} once
     * @returns {Info}
     */
    create(update, once) {
      const { type, node, paths } = this;
      const { length } = paths;
      const updates = length ? [] : empty$1;
      const dom = document.importNode(node, true);
      for (let prevPath, node = dom, i = 0; i < length; i++) {
        const { type, name, path } = paths[i];
        // speed up multiple attributes per same node
        if (path !== empty$1 && path !== prevPath) {
          prevPath = path;
          node = dom;
          for (let { length } = path, i = 0; i < length; i++)
            node = node.childNodes[path[i]];
        }
        updates[i] = type === ATTRIBUTE_NODE ?
          update[ATTRIBUTE_NODE](node, name, once) :
          update[type](node, once);
      }
      return new Info(
        type === DOCUMENT_FRAGMENT_NODE ? new Fragment(dom) : dom,
        updates,
      );
    }
  }
  
  class Lazy {
    constructor(key, map, create) {
      this.key = key;
      this.map = map;
      this.create = create;
    }
  
    /**
     * @param {unknown[]} values
     * @returns {import("../types.js").ParsedNode}
     */
    update(values) {
      const { key, map, create } = this;
      const value = values[key];
      const info = map.get(value) || map.set(value, create());
      return info.update(values);
    }
  }
  
  const DirectMap = direct(Map);
  
  class Keyed extends Node {
    constructor(type, node, paths, key) {
      super(type, node, paths);
      this.key = key;
      this.map = new DirectMap;
    }
    create(update, once) {
      const { key, map } = this;
      return new Lazy(key, map, () => super.create(update, once));
    }
  }
  
  class Path {
    /**
     * @param {1 | 2 | 8} type the node type at that path
     * @param {'#comment' | '#text' | import("../types.js").AttributeName} name either `#comment`, `#text` or the attribute's name
     * @param {number[]} path a list of indexes from the top parent node to retrieve either the attribute element owner, or the node
     */
    constructor(type, name, path) {
      this.type = type;
      this.name = name;
      this.path = path;
    }
  }
  
  const getContent = fragment => {
    const { firstChild: $ } = fragment;
    // empty html`` fragments or html`${[]}` cases
    return $ && $ === fragment.lastChild && $.nodeType !== COMMENT_NODE ?
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
  
  const prefix = '_x';
  const { indexOf } = empty$1;
  
  let key = -1;
  
  /**
   * @param {Node} node
   * @returns {number[]}
   */
  const map = node => {
    const path = [];
    let i = 0, parentNode;
    while (parentNode = node.parentNode) {
      i = path.push(indexOf.call(parentNode.childNodes, node));
      node = parentNode;
    }
    return i < 2 ? (i ? path : empty$1) : path.reverse();
  };
  
  /**
   * @param {boolean} SVG
   * @param {Node} node
   * @param {number[]} paths
   * @param {number} i
   * @returns {number}
   */
  const parse = (SVG, node, paths, i) => {
    switch (node.nodeType) {
      case COMMENT_NODE: {
        // holes
        if (node.data === prefix + i) {
          paths.push(new Path(COMMENT_NODE, '#comment', map(node)));
          i++;
        }
        break;
      }
      case ELEMENT_NODE: {
        let path, search;
        // attributes
        while (node.hasAttribute(search = prefix + i)) {
          const name = node.getAttribute(search);
          if (name === 'key') key = paths.length;
          paths.push(new Path(ATTRIBUTE_NODE, name, path || (path = map(node))));
          node.removeAttribute(search);
          i++;
        }
        // text only elements: plaintext, script, style, textarea, title, xmp
        if (
          !SVG &&
          TEXT_ELEMENTS.test(node.localName) &&
          node.textContent.trim() === `<!--${search}-->`
        ) {
          paths.push(new Path(ELEMENT_NODE, '#text', path || map(node)));
          i++;
        }
        break;
      }
    }
    return i;
  };
  
  /**
   * @param {boolean} SVG indicate SVG parser VS an HTML one
   * @returns {(template:TemplateStringsArray|string[]) => Node}
   */
  var parser = SVG => {
    const content = SVG ? svg$1 : html$1;
    return template => {
      const text = parser$1(template, prefix, SVG);
      const node = content(text);
      const length = template.length - 1;
      let paths = empty$1;
      if (length) {
        let i = parse(SVG, node, paths = [], 0);
        if (i < length) {
          const tw = document.createTreeWalker(node, 1 | 128);
          while (i < length) i = parse(SVG, tw.nextNode(), paths, i);
        }
      }
      const Class = key < 0 ? Node : Keyed;
      const parsed = new Class(node.nodeType, node, paths, key);
      key = -1;
      return parsed;
    };
  };
  
  const DirectWeakMap = direct(WeakMap);
  
  let rendering = null;
  const dwm = new DirectWeakMap;
  /**
   * @param {ParentNode} where
   * @param {() => import("../types.js").ParsedNode} what
   * @returns {ParentNode}
   */
  const render = (where, what) => {
    const prev = rendering;
    rendering = dwm.get(where) || dwm.set(where, new Stack);
    try { rendering.update(where, what()); }
    finally { rendering = prev; }
    return where;
  };
  
  /**
   * @param {import("./types.js").Node} node
   * @param {import("./types.js").Update} update
   * @param {unknown[]} values
   * @returns {import("./types.js").ParsedNode}
   */
  const one = (node, update, values) => node.create(update, true).update(values);
  
  /**
   * @param {boolean} SVG
   * @param {unknown} attr
   * @param {unknown} diff
   * @returns {import("./types.js").ParsedNode}
   */
  const tag = (SVG, attr, diff) => {
    const dwm = new DirectWeakMap;
    const parse = parser(SVG);
    const update = {
      [ATTRIBUTE_NODE]: (node, name, once) => {
        let c = name[0], k = c in attr ? c : (name in attr ? name : attribute);
        return attr[k](node, c === k ? name.slice(1) : name, once, SVG);
      },
      [COMMENT_NODE]: (node, once) => diff(node, once, SVG),
      [ELEMENT_NODE]: node => value => {
        node.textContent = value == null ? '' : value;
      },
    };
  
    /**
     * @param {TemplateStringsArray | string[]} template
     * @param {...unknown} values
     */
    return (template, ...values) => (rendering?.parse || one)(
      dwm.get(template) || dwm.set(template, parse(template)),
      update,
      values,
    )
  };
  
  const setClassName = (node, _, value) => {
    node.className = value == null ? '' : value;
  };
  
  const setStyle = (style, _, value) => {
    style.cssText = value == null ? '' : value;
  };
  
  const storeValueFor = (callback, node, name) => {
    let prev;
    return curr => {
      if (curr != prev) {
        prev = curr;
        callback(node, name, curr);
      }
    };
  };
  
  // pretty much what uhtml exports except
  // onclick and others are not that smart
  // use .onclick or others to signal accessors intent
  // (explicit is better than implicit and related reason)
  var attrs = {
    __proto__: null,
    // this is by default a no-op as it does nothing on updates but
    // it's passed value is used to return the keyed node
    key: key$1,
    // default attributes handler
    [attribute]: (node, name, once) => once ?
      value => setAttribute(node, name, value) :
      storeValueFor(setAttribute, node, name)
    ,
    // special attributes handlers
    ['@']: (node, type, once) => once ?
      value => {
        const listener = isArray(value) ? value : [value || null];
        node.addEventListener(type, ...listener);
      } :
      handleListener(node, type)
    ,
    ['?']: (node, name, once) => once ?
      value => toggleAttribute(node, name, value) :
      storeValueFor(toggleAttribute, node, name)
    ,
    ['.']: (node, prop, once) => once ?
      value => setProperty(node, prop, value) :
      storeValueFor(setProperty, node, prop)
    ,
    // augmented attributes handler
    aria: node => props => {
      for (const key in props) {
        const name = key === 'role' ? key : `aria-${key}`;
        setAttribute(node, name, props[key]);
      }
    },
    class: (node, name, once, SVG) => (once || SVG) ?
      value => setAttribute(node, name, value) :
      storeValueFor(setClassName, node, name)
    ,
    data: ({ dataset }) => props => {
      for (const key in props) {
        const value = props[key];
        if (value == null) delete dataset[key];
        else dataset[key] = value;
      }
    },
    ref: node => value => {
      if (typeof value === 'function') value(node);
      else value.current = node;
    },
    style: ({ style }, name, once) => once ?
      value => setStyle(style, name, value) :
      storeValueFor(setStyle, style, name)
    ,
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
  
  const { diff } = Fragment;
  
  const array = (node, prev) => curr => {
    prev = udomdiff(
      node.parentNode,
      prev,
      curr.length ? curr : empty$1,
      diff,
      node
    );
  };
  
  const dom = prev => curr => {
    if (prev !== curr) {
      const value = curr.valueOf();
      prev.replaceWith(value);
      prev = value;
    }
  };
  
  const multi = node => {
    let init = true;
    let update;
    return value => {
      if (init) {
        init = false;
        if (isObject(value)) {
          if (isArray(value)) update = array(node, empty$1);
          else update = dom(node);
        }
        else {
          let prev = '';
          const text = document.createTextNode(prev);
          node.replaceWith(text);
          update = value => {
            const curr = value == null ? '' : value;
            if (curr !== prev) {
              prev = curr;
              text.data = curr;
            }
          };
        }
      }
      update(value);
    };
  };
  
  const oneOff = node => value => {
    if (isObject(isObject)) {
      if (isArray(value)) {
        const f = document.createDocumentFragment();
        f.replaceChildren(...value.map(v => v.valueOf()));
        value = f;
      }
      else value = value.valueOf();
    }
    else {
      value = document.createTextNode(value == null ? '' : value);
    }
    node.replaceWith(value);
  };
  
  var differ = (node, once) => (once ? oneOff : multi)(node);
  
  const html = tag(false, attrs, differ);
  const svg = tag(true, attrs, differ);
  
  const component = callback => (...args) => () => callback(...args);
  
  return { component, html, render, svg };
};
