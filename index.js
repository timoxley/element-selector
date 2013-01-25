var classes = require('classes')
var matches = require('matches-selector')

var Emitter = require('emitter')
var bus = new Emitter()

var initialized = false

var initialize = function() {
  if (initialized) return
  initialized = true
  document.addEventListener('mouseover', function(e) {
    bus.emit('mouseover', e.target, e)
  })
  document.addEventListener('mouseout', function(e) {
    bus.emit('mouseout', e.target, e)
  })
  document.addEventListener('click', function(e) {
    bus.emit('click', e.target, e)
  })
  document.addEventListener('mouseup', function(e) {
    bus.emit('mouseup', e.target, e)
  })
  document.addEventListener('mousedown', function(e) {
    bus.emit('mousedown', e.target, e)
  })
  document.addEventListener('dblclick', function(e) {
    bus.emit('dblclick', e.target, e)
  })
}()

module.exports = function(options) {
  return new ElementSelector(options)
}

module.exports.ElementSelector = ElementSelector

function ElementSelector(options) {
  options = options || {}
  this.selector = options.selector || 'body *'
  this.invalidSelector = options.invalidSelector || ''

  this.highlightedClass = options.hasOwnProperty('highlightedClass')
    ? options.highlightedClass || null
    : 'highlighted'
  this.selectedClass = options.hasOwnProperty('selectedClass')
    ? options.selectedClass || null
    : 'selected'

  this.selectEvent = options.hasOwnProperty('selectEvent')
    ? options.selectEvent || null
    : 'click'

  this.enabled = options.hasOwnProperty('enabled')
    ? !!options.enabled
    : true

  this.useDefaultStyles = options.hasOwnProperty('useDefaultStyles')
    ? !!options.useDefaultStyles
    : true

  if (this.useDefaultStyles) {
    classes(document.body).add('element-selector')
  }

  this.highlighted = null
  this.highlight = highlight.bind(this)
  this.dehighlight = dehighlight.bind(this)
  this.select = select.bind(this)
  this.deselect = deselect.bind(this)
  this.disable = disable.bind(this)
  this.enable = enable.bind(this)
  this.matches = elMatches.bind(this)

  bus.on('mouseover', this.highlight)
  bus.on('mouseout', this.dehighlight)
  bus.on(this.selectEvent, this.select)
}

ElementSelector.prototype = {}

function disable() {
  this.deselect()
  this.enabled = false
  return this
}

function enable() {
  this.enabled = true
  return this
}

function elMatches(el) {
  return !! el && matches(el, this.selector) && this.invalidSelector && !matches(el, this.invalidSelector)
}

function highlight(el, e) {
  if (!this.enabled) return
  if (this.matches(el)) {
    if (this.highlighted && this.highlighted !== el) this.dehighlight(this.highlighted)
    classes(el).add(this.highlightedClass)
    this.highlighted = el
    this.emit('highlight', el, e)
  }
}

function dehighlight(el, e) {
  if (!this.enabled) return
  el = el || this.highlighted
  if (this.matches(el)) {
    classes(el).remove(this.highlightedClass)
    this.highlighted = null
    this.emit('dehighlight', el, e)
  }
}

function select(el, e) {
  if (!this.enabled) return
  if (this.selected) this.deselect(null, e)
  if (this.matches(el)) {
    this.dehighlight()
    classes(el).add(this.selectedClass)
    this.selected = el
    this.emit('select', el, e)
  }
}

function deselect(el, e) {
  if (!this.enabled) return
  el = el || this.selected
  if (this.matches(el)) {
    this.dehighlight()
    classes(el).remove(this.selectedClass)
    this.selected = null
    this.emit('deselect', el, e)
  }
}


Emitter(ElementSelector.prototype)

