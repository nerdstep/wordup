export type Context = Element | Element[] | NodeList | null

export interface Options {
  baseClass: string
  regex: RegExp
  splitter: string
  joiner: string
  exclude: string[]
  tagName: string
  template: (value: string) => string
}

export default class WordUp {
  private readonly options: Options
  private readonly elements: Element[]
  private readonly original: string[]

  constructor(ctx: Context, options?: Options) {
    const baseClass = options?.baseClass ?? 'wu'
    const mergedOptions = {
      ...{
        baseClass,
        regex: /\w/,
        splitter: ' ',
        joiner: ' ',
        tagName: 'unwrap',
        exclude: ['a', 'button'],
        template: (item: string) => `<span class="${baseClass}">${item}</span>`,
      },
      ...options,
    }
    this.options = mergedOptions
    this.elements = WordUp.contextToArray(ctx)
    this.original = this.backup()
  }

  // Returns an array of elements from a given DOM context
  static contextToArray(context: any) {
    let elements: HTMLElement[] = []

    // HTMLElement
    // must use `window.` or jsdom will fail
    if (context instanceof window.HTMLElement) {
      elements = [context]
      // NodeList
    } else if ({}.isPrototypeOf.call(window.NodeList, context)) {
      elements = Array.prototype.slice.call(context)
    }

    return elements
  }

  static unwrap(node: Node) {
    // Get the parent node
    const parent = node.parentNode

    // Move all children out of the node
    while (node.firstChild) parent?.insertBefore(node.firstChild, node)

    // Remove the empty node
    parent?.removeChild(node)
  }

  static unwrapper(element: Node, tagName: string) {
    const nodes = element.childNodes

    for (const node of nodes) {
      if (node.nodeName?.toLowerCase() === tagName) {
        WordUp.unwrap(node)
      } else {
        WordUp.unwrapper(node, tagName)
      }
    }
  }

  backup() {
    return this.elements.map((element) => element.innerHTML)
  }

  filterNodes(nodes: NodeListOf<ChildNode>) {
    const { exclude } = this.options
    const filtered: Node[] = []

    for (const node of nodes) {
      const name = node.nodeName ? node.nodeName.toLowerCase() : ''

      if (!exclude.includes(name)) {
        filtered.push(node)
      }
    }

    return filtered
  }

  wrap(element: Node) {
    const { joiner, regex, splitter, tagName, template } = this.options
    const text = element.textContent ?? ''
    const newElement = document.createElement(tagName)

    const items = text
      .split(splitter)
      .map((item) => (regex.test(item) ? template(item) : item))

    newElement.innerHTML = items.join(joiner)

    return newElement
  }

  wrapper(element: Node) {
    // Get the node's children, filtered to exclude unwanted tags
    const nodes = this.filterNodes(element.childNodes)

    for (const node of nodes) {
      // If node is a non-space text node then wrap the text,
      // otherwise recursively process the child nodes
      if (
        node.nodeType === node.TEXT_NODE &&
        node.nodeValue &&
        node.nodeValue.trim().length > 0
      ) {
        const newElement = this.wrap(node)

        // Insert the new element before the current one
        node.parentNode?.insertBefore(newElement, node)

        // Finally remove the text node
        node.parentNode?.removeChild(node)
      } else {
        this.wrapper(node)
      }
    }
  }

  destroy() {
    this.elements.forEach((element, i: number) => {
      element.innerHTML = this.original[i]
    })
  }

  init(cb?: (elements: Element[]) => void) {
    this.elements.forEach((element) => {
      this.wrapper(element)
      WordUp.unwrapper(element, this.options.tagName)
    })

    if (typeof cb === 'function') cb(this.elements)
  }
}
