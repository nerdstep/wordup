/*! WordUp v0.1.0, @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.WordUp = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var WordUp$1 = function () {

  /**
   * @param {HTMLElement|HTMLElement[]|NodeList} ctx
   * @param {object} options
   */
  function WordUp(ctx) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    classCallCheck(this, WordUp);

    this.ctx = ctx;
    this.options = options;
    this.tagName = 'unwrap';
    this.elements = WordUp.contextToArray(ctx);
    this.original = this.backup();
  }

  createClass(WordUp, [{
    key: 'backup',
    value: function backup() {
      var items = [];

      this.elements.forEach(function (el) {
        items.push(el.innerHTML);
      });

      return items;
    }
  }, {
    key: 'filterNodes',
    value: function filterNodes(nodes) {
      var filtered = [];
      var tagName = void 0;
      var n = void 0;

      for (var i = 0; i < nodes.length; i += 1) {
        n = nodes[i];
        tagName = n.tagName ? n.tagName.toLowerCase() : '';

        if (!this.opt.exclude.includes(tagName)) filtered.push(n);
      }

      return filtered;
    }
  }, {
    key: 'wrap',
    value: function wrap(el) {
      var _this = this;

      var text = WordUp.textContent(el);
      var newEl = document.createElement(this.tagName);
      var items = text.split(this.opt.splitter);

      items = items.map(function (item) {
        if (_this.opt.regex.test(item)) return _this.opt.template(item);
        return item;
      });

      items = items.join(this.opt.joiner);
      newEl.innerHTML = items;

      return newEl;
    }
  }, {
    key: 'wrapper',
    value: function wrapper(el) {
      // get the element's children, filtered to exclude unwanted tags
      var nodes = this.filterNodes(el.childNodes);
      var n = void 0;

      for (var i = 0; i < nodes.length; i += 1) {
        n = nodes[i];

        // if element is a non-space text node then wrap the text
        // otherwise recursively process the child nodes
        if (n.nodeType === n.TEXT_NODE && n.nodeValue.trim().length) {
          var newEl = this.wrap(n);

          // insert the new element before the current one
          n.parentNode.insertBefore(newEl, n);

          // finally remove the text node
          n.parentNode.removeChild(n);
        } else {
          this.wrapper(n);
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      this.elements.forEach(function (el, i) {
        el.innerHTML = _this2.original[i];
      });
    }
  }, {
    key: 'init',
    value: function init(cb) {
      var _this3 = this;

      this.elements.forEach(function (el) {
        _this3.wrapper(el);
        WordUp.unwrapper(el, _this3.tagName);
      });

      if (typeof cb === 'function') cb(this.elements);
    }
  }, {
    key: 'options',
    set: function set(opts) {
      var _this4 = this;

      this.opt = Object.assign({}, {
        baseClass: 'wu',
        regex: /\w/,
        splitter: ' ',
        joiner: ' ',
        exclude: ['a', 'button'],
        template: function template(item) {
          return '<span class="' + _this4.opt.baseClass + '">' + item + '</span>';
        }
      }, opts);
    },
    get: function get() {
      return this.opt;
    }

    // returns an array of elements from a given DOM context

  }], [{
    key: 'contextToArray',
    value: function contextToArray(context) {
      var ctx = void 0;

      if (!context) {
        ctx = [];
        // HTMLElement
        // must use `window.` or jsdom will fail
      } else if (context instanceof window.HTMLElement) {
        ctx = [context];
        // NodeList
      } else if ({}.isPrototypeOf.call(window.NodeList, context)) {
        ctx = Array.prototype.slice.call(context);
      }

      return ctx;
    }

    // returns the text content of an element

  }, {
    key: 'textContent',
    value: function textContent(el) {
      // el.innerText for IE compatibility
      return el.textContent || el.innerText;
    }
  }, {
    key: 'unwrap',
    value: function unwrap(el) {
      // get the element's parent node
      var parent = el.parentNode;

      // move all children out of the element
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      } // remove the empty element
      parent.removeChild(el);
    }
  }, {
    key: 'unwrapper',
    value: function unwrapper(el, tagName) {
      var nodes = el.childNodes;

      for (var i = 0; i < nodes.length; i += 1) {
        var n = nodes[i];
        if (n.tagName && n.tagName.toLowerCase() === tagName) {
          WordUp.unwrap(n);
        } else {
          WordUp.unwrapper(n, tagName);
        }
      }
    }
  }]);
  return WordUp;
}();

return WordUp$1;

})));
