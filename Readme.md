
# mouse-select

  Use mouse to highlight and select html elements



## Installation

```
$ component install timoxley/mouse-select
```

## Example

```js
var MouseSelect = require('mouse-select');
var mouseSelect = MouseSelect();

```

## Options
  - [selector](#selector)
  - [selectEvent](#selectEvent)
  - [selectedClass](#selectedClass)
  - [highlightedClass](#highlightedClass)
 
<a name="selector" />
### selector
Only trigger select/highlight events on elements matching this selector.
Defaults to `body *`.
```js
// Only trigger on paragraphs inside #content
var mouseSelect = MouseSelect({
  selector: "#content p"
})
```

<a name="selectEvent" />
### selectEvent 
Mouse event to trigger selection. Must be one of `click`,
`mouseup` or `mousedown`. Defaults to `click`
```js
// Trigger on 'mousedown' instead of 'click'
var mouseSelect = MouseSelect({
  selectEvent: "mousedown"
})
```


<a name="selectedClass" />
### selectedClass
```js
// elements will get class "editable" when they are highlighted 
var mouseSelect = MouseSelect({
  highlightedClass: "editable"
})
```

<a name="highlightedClass" />
### highlightedClass
```js
// elements will get class "glow" when they are highlighted
var mouseSelect = MouseSelect({
  highlightedClass: "glow"
})
```

## Events

Events are fired whenever an element's selected or highlighted status
changes.

Events will be one of the following:

  - select
  - deselect
  - highlight
  - dehighlight

MouseSelect's event API is inherited from
[component/emitter](https://github.com/component/emitter).

### Example

```js

mouseSelect.on('select', function(el) {
  console.log('element selected', el)
})

mouseSelect.once('dehighlight', function(el) {
  console.log('element dehighlighted', el)
})

```
