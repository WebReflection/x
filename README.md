# @webreflection/x

X-HTML & SVG core functionalities for template literal parsing, offering a basic solution all inclusive within 2KB minified and brotlied.

### x/html

This is also the default export and it offers already a lot:

  * `@`, `.` and `?` attributes prefix work like in *uhtml*
  * other attributes work via `setAttribute` or `removeAttribute` if the value is `null`
  * `html` and `svg` returns already updated nodes if used outside a `render` call
  * nodes and primitives are supported as interpolations
  * **no** Arrays, callbacks, or other custom things are supported but it's possible to bring in your own logic for both *attributes* and *interpolated* values

**Example**
```js
import { render, html, svg, component } from '@webreflection/x';

document.body.appendChild(
  // one off fragment
  html`
    <span class=${'a'} />
    ${'content'}
    <span class=${'b'} />
  `
);

document.body.innerHTML;
// <span class="a"></span>
// content
// <span class="b"></span>

// components friendly
const App = component((name) => html`<h1>Hello ${name}!</h1>`);

render(document.body, App('World'));

setTimeout(() => {
  render(document.body, App('User'));
});

// direct render
render(document.body, () => html`<div>Hello There!</div>`);
```

### x/tag

Allow custom parsing for both attributes and nodes meant as interpolation.

This is basically how `x/html` is created:
```js
import { render, attribute, tag } from '@webreflection/x/tag';
// attribute is a symbol used as default attribute parser
// when no other special cases are meant

import attrs from '@webreflection/x/attributes';
import differ from '@webreflection/x/differ';
export const html = tag(false, attrs, differ);
export const svg = tag(true, attrs, differ);

export const component = callback => (...args) => () => callback(...args);
```

Feel free to check [attributes](./src/attributes.js) or [differ](./src/differ.js) implementations to know more.

The first argument is a `boolean` that indicates if the node was created for a *one-off* operation or not.

When `html` and `svg` tags are used outside a `render` call, that value is `true`, meaning the node is created once like *uhtml/node* would do.

In all other cases *updates* will be applied per each render over the same node and callback returning the same templates around.
