/*! WordUp v0.0.4, @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.WordUp = factory());
}(this, function () { 'use strict';

  var WordUp = function WordUp(ctx, options) {
    if ( options === void 0 ) options = {};

    this.ctx = ctx
    this.options = options
    this.tagName = 'unwrap'
    this.elements = this.getElements()
    this.original = this.backup()
  };

  var prototypeAccessors = { options: {} };

  prototypeAccessors.options.set = function (opts) {
      var this$1 = this;

    this.opt = Object.assign({}, {
      baseClass: 'wu',
      regex: /\w/,
      splitter: ' ',
      joiner: ' ',
      exclude: ['a', 'button'],
      template: function (item) { return ("<span class=\"" + (this$1.opt.baseClass) + "\">" + item + "</span>"); },
    }, opts)
  };

  prototypeAccessors.options.get = function () {
    return this.opt
  };

  WordUp.prototype.backup = function backup () {
    var items = []

    this.elements.forEach(function (el) {
      items.push(el.innerHTML)
    })

    return items
  };

  // shamelessly borrowed from https://github.com/julmot/mark.js
  WordUp.prototype.getElements = function getElements () {
    var ctx

    if (typeof this.ctx === 'undefined') {
      ctx = []
    } else if (this.ctx instanceof HTMLElement) {
      ctx = [this.ctx]
    } else if (Array.isArray(this.ctx)) {
        ctx = this.ctx
    } else { // NodeList
      ctx = Array.prototype.slice.call(this.ctx)
    }

    return ctx
  };

  WordUp.prototype.getText = function getText (el) {
    return el.textContent || el.innerText
  };

  WordUp.prototype.filterNodes = function filterNodes (nodes) {
      var this$1 = this;

    var filtered = []
    var tagName
    var n

    for (var i = 0; i < nodes.length; ++i) {
      n = nodes[i]
      tagName = n.tagName ? n.tagName.toLowerCase() : ''

      if (!this$1.opt.exclude.includes(tagName)) filtered.push(n)
    }

    return filtered
  };

  WordUp.prototype.wrap = function wrap (el) {
      var this$1 = this;

    var text = this.getText(el)
    var newEl = document.createElement(this.tagName)
    var items = text.split(this.opt.splitter)

    items = items.map(function (item) {
      if (this$1.opt.regex.test(item)) return this$1.opt.template(item)
      return item
    })

    items = items.join(this.opt.joiner)
    newEl.innerHTML = items

    return newEl
  };

  WordUp.prototype.wrapper = function wrapper (el) {
      var this$1 = this;

    // get the element's children, filtered to exclude unwanted tags
    var nodes = this.filterNodes(el.childNodes)
    var n

    for (var i = 0; i < nodes.length; ++i) {
      n = nodes[i]

      // if element is a non-space text node then wrap the text
      // otherwise recursively process the child nodes
      if (n.nodeType === n.TEXT_NODE && n.nodeValue.trim().length) {
        var newEl = this$1.wrap(n)

        // insert the new element before the current one
        n.parentNode.insertBefore(newEl, n)

        // finally remove the text node
        n.parentNode.removeChild(n)
      } else {
        this$1.wrapper(n)
      }
    }
  };

  WordUp.prototype.unwrap = function unwrap (el) {
    // get the element's parent node
    var parent = el.parentNode

    // move all children out of the element
    while (el.firstChild) parent.insertBefore(el.firstChild, el)

    // remove the empty element
    parent.removeChild(el)
  };

  WordUp.prototype.unwrapper = function unwrapper (el) {
      var this$1 = this;

    var nodes = el.childNodes

    for (var i = 0; i < nodes.length; ++i) {
      var n = nodes[i]
      if (n.tagName && n.tagName.toLowerCase() === this$1.tagName) this$1.unwrap(n)
      else this$1.unwrapper(n)
    }
  };

  WordUp.prototype.destroy = function destroy () {
      var this$1 = this;

    this.elements.forEach(function (el, i) {
      el.innerHTML = this$1.original[i]
    })
  };

  WordUp.prototype.init = function init (cb) {
      var this$1 = this;

    this.elements.forEach(function (el) {
      this$1.wrapper(el)
      this$1.unwrapper(el)
    })

    if (typeof cb === 'function') cb(this.elements)
  };

  Object.defineProperties( WordUp.prototype, prototypeAccessors );

  return WordUp;

}));