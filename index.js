var classes = require('classes')
var matches = require('matches-selector')

var Emitter = require('emitter')
var bus = require('bus')

var initialized = false

var initialize = function() {
  if (initialized) return
  initialized = true
  document.addEventListener('mouseover', function(e) {
    bus.emit('mouseover', e.target)
  })
  document.addEventListener('mouseout', function(e) {
    bus.emit('mouseout', e.target)
  })
  document.addEventListener('click', function(e) {
    bus.emit('click', e.target)
  })
  document.addEventListener('mouseup', function(e) {
    bus.emit('mouseup', e.target)
  })
  document.addEventListener('mousedown', function(e) {
    bus.emit('mousedown', e.target)
  })
  document.addEventListener('dblclick', function(e) {
    bus.emit('dblclick', e.target)
  })
}()

module.exports = function(options) {
  return new MouseSelect(options)
}

module.exports.MouseSelect = MouseSelect

function MouseSelect(options) {
  options = options || {}
  this.selector = options.selector || 'body *'

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


  this.highlighted = null
  this.highlight = highlight.bind(this)
  this.dehighlight = dehighlight.bind(this)
  this.select = select.bind(this)
  this.deselect = deselect.bind(this)
  this.disable = disable.bind(this)
  this.enable = enable.bind(this)

  bus.on('mouseover', this.highlight)
  bus.on('mouseout', this.dehighlight)
}

MouseSelect.prototype = {}

function disable() {
  this.dehighlight()
  this.deselect()
  this.enabled = false
}

function enable() {
  this.enabled = true
}

function highlight(el) {
  if (!this.enabled) return
  bus.once(this.selectEvent, this.select)
  if (el && matches(el, this.selector)) {
    if (this.highlighted && this.highlighted !== el) this.dehighlight(this.highlighted)
    classes(el).add(this.highlightedClass)
    this.highlighted = el
    this.emit('highlight', el)
  }
}

function dehighlight(el) {
  if (!this.enabled) return
  el = el || this.highlighted
  if (el && matches(el, this.selector)) {
    bus.off(this.selectEvent, this.select)
    classes(el).remove(this.highlightedClass)
    this.highlighted = null
    this.emit('dehighlight', el)
  }
}

function select(el) {
  if (!this.enabled) return
  if (this.selected) this.deselect()
  if (el && matches(el, this.selector)) {
    this.dehighlight()
    classes(el).add(this.selectedClass)
    this.selected = el
    this.emit('select', el)
  }
}

function deselect(el) {
  if (!this.enabled) return
  el = el || this.selected
  if (el && matches(el, this.selector)) {
    classes(el).remove(this.selectedClass)
    this.selected = null
    this.emit('deselect', el)
  }
}


Emitter(MouseSelect.prototype)

