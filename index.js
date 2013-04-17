"use strict"

var debug = require('debug')('element-selector')

var Emitter = require('emitter')
var classes = require('classes')
var matchesSelector = require('matches-selector')
var DEFAULT_SELECTOR = 'body *'
var DEFAULT_INVALID_SELECTOR = ''
var DEFAULT_HIGHLIGHTED_CLASS = 'highlighted'
var DEFAULT_SELECTED_CLASS = 'selected'
var DEFAULT_SELECT_EVENT = 'click'
var DEFAULT_PREFIX_CLASS = 'element-selector'
var DEFAULT_ROOT_ELEMENT = document.body

var DEFAULT_ENABLED = false
var DEFAULT_USE_STYLES = true

function ElementSelector(options) {
  if (!(this instanceof ElementSelector)) return new ElementSelector(options)

  options = options || {}
  this.selector = options.selector || DEFAULT_SELECTOR
  this.invalidSelector = options.invalidSelector || DEFAULT_INVALID_SELECTOR

  this.highlightedClass = options.highlightedClass || DEFAULT_HIGHLIGHTED_CLASS

  this.selectedClass = options.selectedClass || DEFAULT_SELECTED_CLASS

  this.selectEvent = options.selectEvent || DEFAULT_SELECT_EVENT

  this.prefixClass = options.prefixClass || DEFAULT_PREFIX_CLASS

  this.useDefaultStyles = options.useDefaultStyles != null ? options.useDefaultStyles : DEFAULT_USE_STYLES

  this.root = options.root || DEFAULT_ROOT_ELEMENT

  this.enabled = options.enabled != null // Likely a Boolean
    ? !!options.enabled
    : DEFAULT_ENABLED

  this.highlighted = undefined

  bus.on('mouseover', this.highlight.bind(this))
  bus.on(this.selectEvent, this.select.bind(this))

  this.enabled ? this.enable() : this.disable()
}


ElementSelector.prototype.matches = function matches(el) {
  return !! el && matchesSelector(el, this.selector) &&
         !(this.invalidSelector && matchesSelector(el, this.invalidSelector))
}

ElementSelector.prototype.disable = function disable() {
  debug('disable')
  this.enabled = false
  this.deselect()
  return this
}

ElementSelector.prototype.enable = function enable() {
  debug('enable')
  this.enabled = true
  if (!this.useDefaultStyles) return this
  classes(this.root).add(this.prefixClass)
  return this
}

ElementSelector.prototype.highlight = function highlight(el, e) {
  if (!this.enabled) return this
  if (this.matches(el)) {
    if (this.highlighted && this.highlighted !== el) this.dehighlight(this.highlighted)
    classes(el).add(this.highlightedClass)
    this.highlighted = el
    debug('highlight', el, e)
    this.emit('highlight', el, e)
  }
  return this
}

ElementSelector.prototype.dehighlight = function dehighlight() {
  if (!this.enabled || !this.highlighted) return this
  var el = this.highlighted
  classes(el).remove(this.highlightedClass)
  this.highlighted = null
  debug('dehighlight', el)
  this.emit('dehighlight', el)
  return this
}

ElementSelector.prototype.select = function select(el, e) {
  if (!this.enabled) return this
  if (this.matches(el)) {
    this.deselect()
    this.dehighlight()
    classes(el).add(this.selectedClass)
    this.selected = el
    debug('select', el, e)
    this.emit('select', el, e)
  }
}

ElementSelector.prototype.deselect = function deselect(el, e) {
  if (!this.enabled) return this
  el = el || this.selected
  this.dehighlight()
  classes(el).remove(this.selectedClass)
  this.selected = null
  this.emit('deselect', el, e)
  this.emit('deselect', el, e)
  return this
}

Emitter(ElementSelector.prototype)

/**
 * Global bus for listening to mouse events.
 */

var bus = new Emitter()

function initializeEvents() {
  if (initializeEvents.complete) return
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

  initializeEvents.complete = true
}

initializeEvents()

module.exports = ElementSelector
