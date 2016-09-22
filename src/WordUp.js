
class WordUp {

  /**
   * @param {HTMLElement|HTMLElement[]|NodeList} ctx
   * @param {object} options
   */
  constructor(ctx, options = {}) {
    this.ctx = ctx
    this.options = options
    this.tagName = 'unwrap'
    this.elements = WordUp.contextToArray(ctx)
    this.original = this.backup()
  }

  set options(opts) {
    this.opt = Object.assign({}, {
      baseClass: 'wu',
      regex: /\w/,
      splitter: ' ',
      joiner: ' ',
      exclude: ['a', 'button'],
      template: item => `<span class="${this.opt.baseClass}">${item}</span>`,
    }, opts)
  }

  get options() {
    return this.opt
  }

  // returns an array of elements from a given DOM context
  static contextToArray(context) {
    let ctx

    if (!context) {
      ctx = []
    // HTMLElement
    // must use `window.` or jsdom will fail
    } else if (context instanceof window.HTMLElement) {
      ctx = [context]
    // NodeList
    } else if ({}.isPrototypeOf.call(window.NodeList, context)) {
      ctx = Array.prototype.slice.call(context)
    }

    return ctx
  }

  // returns the text content of an element
  static textContent(el) {
    // el.innerText for IE compatibility
    return el.textContent || el.innerText
  }

  static unwrap(el) {
    // get the element's parent node
    const parent = el.parentNode

    // move all children out of the element
    while (el.firstChild) parent.insertBefore(el.firstChild, el)

    // remove the empty element
    parent.removeChild(el)
  }

  static unwrapper(el, tagName) {
    const nodes = el.childNodes

    for (let i = 0; i < nodes.length; i += 1) {
      const n = nodes[i]
      if (n.tagName && n.tagName.toLowerCase() === tagName) {
        WordUp.unwrap(n)
      } else {
        WordUp.unwrapper(n, tagName)
      }
    }
  }

  backup() {
    const items = []

    this.elements.forEach((el) => {
      items.push(el.innerHTML)
    })

    return items
  }

  filterNodes(nodes) {
    const filtered = []
    let tagName
    let n

    for (let i = 0; i < nodes.length; i += 1) {
      n = nodes[i]
      tagName = n.tagName ? n.tagName.toLowerCase() : ''

      if (!this.opt.exclude.includes(tagName)) filtered.push(n)
    }

    return filtered
  }

  wrap(el) {
    const text = WordUp.textContent(el)
    const newEl = document.createElement(this.tagName)
    let items = text.split(this.opt.splitter)

    items = items.map((item) => {
      if (this.opt.regex.test(item)) return this.opt.template(item)
      return item
    })

    items = items.join(this.opt.joiner)
    newEl.innerHTML = items

    return newEl
  }

  wrapper(el) {
    // get the element's children, filtered to exclude unwanted tags
    const nodes = this.filterNodes(el.childNodes)
    let n

    for (let i = 0; i < nodes.length; i += 1) {
      n = nodes[i]

      // if element is a non-space text node then wrap the text
      // otherwise recursively process the child nodes
      if (n.nodeType === n.TEXT_NODE && n.nodeValue.trim().length) {
        const newEl = this.wrap(n)

        // insert the new element before the current one
        n.parentNode.insertBefore(newEl, n)

        // finally remove the text node
        n.parentNode.removeChild(n)
      } else {
        this.wrapper(n)
      }
    }
  }

  destroy() {
    this.elements.forEach((el, i) => {
      el.innerHTML = this.original[i]
    })
  }

  init(cb) {
    this.elements.forEach((el) => {
      this.wrapper(el)
      WordUp.unwrapper(el, this.tagName)
    })

    if (typeof cb === 'function') cb(this.elements)
  }
}

export default WordUp
