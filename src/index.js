import add from './add'
import backspace from './backspace'
import del from './del'
import display from './display'
import each from './each'
import operators from './operators'
import recalculate from './recalculate'
import view from './view'

/**
 * Create a mje instance.
 * @param {HTMLElement|String} target HTML Element or string selector
 */
export default function mje(target) {
  if (!MathJax) {
    throw new Error('mje: MathJax not found. Ensure that MathJax is loaded before calling mje.')
  }

  /** @type {Object} Public API of the library. */
  const api = {}
  /** @type {HTMLElement} Value of this instance. */
  let math = MathJax.HTML.Element('math')
  /** Create the user interface of this instance. */
  const ui = view()

  /** @type {HTMLElement} Current editor cursor element. */
  let current = math
  /** @type {Object} Current editor cursor data. */
  let pos = null
  /** @type {Array} Path of editor cursor data. */
  let path = null
  /** @type {Boolean} */
  let readonly = false

  /**
   * Draw the cursor in the viewport.
   * @return {Void}
   */
  const draw = () => {
    pos = path.find(predicate => {
      return predicate.source === current
    })
    ui.draw(pos)
  }

  /**
   * Update the math in the viewport.
   * @param {HTMLElement} to Cursor position element.
   * @param {HTMLElement} math Root value element.
   * @return {Void}
   */
  const update = (to, math) => {
    if (to) {
      ui.unblink()
      current = to
    }
    if (math) {
      return ui.value(display(math)).then(() => {
        path = recalculate(math)
        draw()
      })
    }
    return draw()
  }

  /**
   * Check whether it is possible to input a change in the value.
   * @return {Boolean}
   */
  const canInput = () => {
    if (!readonly) {return true}
    let curr = current
    while (curr) {
      if (curr.hasAttribute('editable')) {
        return true
      }
      curr = curr.parentNode
    }
    return false
  }

  // API functions

  api.raw = () => {
    return math
  }
  
  api.path = () => {
    return path
  }

  api.right = () => {
    update(pos.next)
  }

  api.left = () => {
    update(pos.previous)
  }

  api.del = () => {
    if (!canInput()) {return} 
    update(del(math, current), math)
  }

  api.backspace = () => {
    if (!canInput()) {return} 
    update(backspace(math, current), math)
  }

  api.number = n => {
    if (!canInput()) {return} 
    const mn = MathJax.HTML.Element('mn', null, [n])
    add(mn, current)
    update(null, math)
  }

  api.identifier = c => {
    if (!canInput()) {return} 
    const mi = MathJax.HTML.Element('mi', null, [c])
    add(mi, current)
    update(null, math)
  }

  api.operator = c => {
    if (!canInput()) {return} 
    const mo = MathJax.HTML.Element('mo', null, [c])
    add(mo, current)
    update(null, math)
  }

  api.frac = () => {
    if (!canInput()) {return} 
    const mfrac = MathJax.HTML.Element('mfrac')
    const mrow1 = MathJax.HTML.Element('mrow')
    const mrow2 = MathJax.HTML.Element('mrow')
    mfrac.appendChild(mrow1)
    mfrac.appendChild(mrow2)
    add(mfrac, current)
    update(mrow1, math)
  }

  api.sqrt = () => {
    if (!canInput()) {return} 
    const msqrt = MathJax.HTML.Element('msqrt')
    const mrow = MathJax.HTML.Element('mrow')
    msqrt.appendChild(mrow)
    add(msqrt, current)
    update(mrow, math)
  }

  api.root = () => {
    if (!canInput()) {return} 
    const mroot = MathJax.HTML.Element('mroot')
    const mrow1 = MathJax.HTML.Element('mrow')
    const mrow2 = MathJax.HTML.Element('mrow')
    mroot.appendChild(mrow1)
    mroot.appendChild(mrow2)
    add(mroot, current)
    update(mrow1, math)
  }

  api.sup = () => {
    if (!canInput()) {return} 
    const msup = MathJax.HTML.Element('msup')
    const mrow1 = MathJax.HTML.Element('mrow')
    const mrow2 = MathJax.HTML.Element('mrow')
    msup.appendChild(mrow1)
    msup.appendChild(mrow2)
    add(msup, current)
    update(mrow1, math)
  }

  api.sub = () => {
    if (!canInput()) {return} 
    const msub = MathJax.HTML.Element('msub')
    const mrow1 = MathJax.HTML.Element('mrow')
    const mrow2 = MathJax.HTML.Element('mrow')
    msub.appendChild(mrow1)
    msub.appendChild(mrow2)
    add(msub, current)
    update(mrow1, math)
  }

  api.subsup = () => {
    if (!canInput()) {return} 
    const msubsup = MathJax.HTML.Element('msubsup')
    const mrow1 = MathJax.HTML.Element('mrow')
    const mrow2 = MathJax.HTML.Element('mrow')
    const mrow3 = MathJax.HTML.Element('mrow')
    msubsup.appendChild(mrow1)
    msubsup.appendChild(mrow2)
    msubsup.appendChild(mrow3)
    add(msubsup, current)
    update(mrow1, math)
  }

  api.get = () => {
    const output = math.cloneNode(true)
    each(output, source => source.removeAttribute('id'))
    return output.outerHTML
  }

  api.set = input => {
    const parser = new DOMParser
    const doc = parser.parseFromString(input, 'text/html')
    math = doc.body.firstElementChild
    math.parentNode.removeChild(math)
    update(math, math)
  }

  api.readonly = val => {
    readonly = val
  }

  // UI functions

  /**
   * Handle cursor placement.
   * @param {Number} x
   * @param {Number} y
   * @return {Void}
   */
  ui.events.click = (x, y) => {
    let smaller = Infinity
    let candidate = null
    for (const data of path) {
      const p1x = data.x
      const p1y = data.y
      const p2x = data.x
      const p2y = p1y + data.height
      const n = Math.abs(((p2y - p1y) * x) - ((p2x - p1x) * y) + (p2x * p1y) - (p2y * p1x))
      const d = n / Math.sqrt(Math.pow(p2y - p1y, 2) + Math.pow(p2x - p1x, 2))
      if (smaller === null || smaller > d) {
        smaller = d
        candidate = data
      }
    }
    if (!candidate || candidate.source === current) {return}
    update(candidate.source)
  }

  /**
   * Handle basic input.
   * @param {String} char
   * @return {Void}
   */
  ui.events.input = (char) => {
    if (char.match(/\d/)) {
      return api.number(char)
    }
    else if (char.match(/[a-zA-Z]/)) {
      return api.identifier(char)
    }
    else if (operators.hasOwnProperty(char)) {
      return api.operator(operators[char])
    }
  }

  /**
   * Handle basic actions.
   * @param {Number} code
   * @return {Void}
   */
  ui.events.code = (code) => {
    console.log(code)
    switch (code) {
    case 8: return api.backspace()
    case 37: return api.left()
    case 39: return api.right()
    case 46: return api.del()
    }
  }

  ui.events.scroll = () => {
    console.log('recalculate')
    path = recalculate(math)
    update(current)
  }

  // Initialization flow

  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  if (!target || !target.parentNode) {
    throw new Error('mje: target element not found.')
  }

  target.parentNode.replaceChild(ui.wrapper(), target)
  MathJax.Hub.processSectionDelay = 0
  update(math, math)

  return api
}