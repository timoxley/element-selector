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

  this.highlighted = null
  this.highlight = highlight.bind(this)
  this.dehighlight = dehighlight.bind(this)
  this.select = select.bind(this)
  this.deselect = deselect.bind(this)

  bus.on('mouseover', this.highlight)
  bus.on('mouseout', this.dehighlight)
}

MouseSelect.prototype = {}

function highlight(el) {
  bus.once(this.selectEvent, this.select)
  if (matches(el, this.selector)) {
    if (this.highlighted && this.highlighted !== el) this.dehighlight(this.highlighted)
    classes(el).add(this.highlightedClass)
    this.highlighted = el
    this.emit('highlight', el)
  }
}

function dehighlight(el) {
  bus.off(this.selectEvent, this.select)
  classes(el).remove(this.highlightedClass)
  this.emit('dehighlight', el)
  this.highlighted = null
}

function select(el) {
  if (this.selected) this.deselect(this.selected)
  if (matches(el, this.selector)) {
    this.dehighlight(el)
    classes(el).add(this.selectedClass)
    this.selected = el
    this.emit('select', el)
  }
}

function deselect(el) {
  if (matches(el, this.selector)) {
    classes(el).remove(this.selectedClass)
    this.selected = null
    this.emit('deselect', el)
  }
}


Emitter(MouseSelect.prototype)

