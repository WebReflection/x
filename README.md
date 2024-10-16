# @webreflection/x

If you're serious about *JSX* like strings or *XML* like template literals to produce valid and expected *HTML*, this is your one stop shop:

  * it's strictly **XML** compliant, it uses the *XML* parsing option indeed
  * errors are embedded and shown/described on the page when these happen
  * attributes require a value, even if empty (i.e. `<input disabled="" />`)
  * it's a template tag, hence it can be used as `x([xhtml])` too
  * it doesn't promote Custom Elements out of the box, you need to `document.importNode(x(['<x-foo />']), true)` explicitly, if that's a desired outcome **before** the node goes live
  * the `@webreflection/x/custom` export allows you to pass a `document`, a `DOMParser`, and a `transform` utility for your interpolations. All have a default `globalThis` value, the `transform` does nothing if not specified.
  * the `@webreflection/x/path` export allows you to parse without caring about attributes quoted boundaries, it is compatible with SVG nodes, and it's not a `tag` function but it accepts `template` like references and an `svg` bolean parameter to let you parse and retrieve a `[fragment, paths]` result, where the `fragment` is the one containing the list of elements and the `paths` is an array of `{ type, name, path }` references that matches the `values` you might have gotten via your own `tag` based function, basically replacing 3 dependencies from *uhtml*

```js
import x from '@webreflection/x';

document.body.appendChild(
  x`<span /><span />`
);

document.body.innerHTML;
// <span></span><span></span>
```

### x/custom
```js
import customX from '@webreflection/x/custom';

const x = customX({
  transform: attribute => `"${attribute}"`
});

document.body.appendChild(
  x`<span test=${1} /><span />`
  //           ^  ^ no quotes around
);

document.body.innerHTML;
// <span test="1"></span><span></span>
```

That's literally it 😇
