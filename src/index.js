import add from './add'
import backspace from './backspace'
import del from './del'
import display from './display'
import id from './id'
import operators from './operators'
import recalculate from './recalculate'
import view from './view'

export default function mje(target) {
  /** @type {Object} Public API of the library. */
  const api = {}
  /** @type {HTMLElement} Value of this instance. */
  const math = MathJax.HTML.Element('math', { id: id() })
  /** Create the user interface of this instance. */
  const ui = view()

  /** @type {HTMLElement} Current editor cursor element. */
  let current = math
  /** @type {Object} Current editor cursor data. */
  let pos = null
  /** @type {Array} Path of editor cursor data. */
  let path = null

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

  // API functions
  
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
    update(del(math, current), math)
  }

  api.backspace = () => {
    update(backspace(math, current), math)
  }

  api.number = (n) => {
    const mn = MathJax.HTML.Element('mn', { id: id() }, [n])
    add(mn, current)
    update(null, math)
  }

  api.identifier = (c) => {
    const mi = MathJax.HTML.Element('mi', { id: id() }, [c])
    add(mi, current)
    update(null, math)
  }

  api.operator = (c) => {
    const mo = MathJax.HTML.Element('mo', { id: id() }, [c])
    add(mo, current)
    update(null, math)
  }

  api.frac = () => {
    const mfrac = MathJax.HTML.Element('mfrac', { id: id() })
    const mrow1 = MathJax.HTML.Element('mrow', { id: id () })
    const mrow2 = MathJax.HTML.Element('mrow', { id: id() })
    mfrac.appendChild(mrow1)
    mfrac.appendChild(mrow2)
    add(mfrac, current)
    update(mrow1, math)
  }

  api.sqrt = () => {
    const msqrt = MathJax.HTML.Element('msqrt', { id: id() })
    const mrow = MathJax.HTML.Element('mrow', { id: id() })
    msqrt.appendChild(mrow)
    add(msqrt, current)
    update(mrow, math)
  }

  api.root = () => {
    const mroot = MathJax.HTML.Element('mroot', { id: id() })
    const mrow1 = MathJax.HTML.Element('mrow', { id: id () })
    const mrow2 = MathJax.HTML.Element('mrow', { id: id() })
    mroot.appendChild(mrow1)
    mroot.appendChild(mrow2)
    add(mroot, current)
    update(mrow1, math)
  }

  api.sup = () => {
    const msup = MathJax.HTML.Element('msup', { id: id() })
    const mrow1 = MathJax.HTML.Element('mrow', { id: id () })
    const mrow2 = MathJax.HTML.Element('mrow', { id: id() })
    msup.appendChild(mrow1)
    msup.appendChild(mrow2)
    add(msup, current)
    update(mrow1, math)
  }

  api.sub = () => {
    const msub = MathJax.HTML.Element('msub', { id: id() })
    const mrow1 = MathJax.HTML.Element('mrow', { id: id () })
    const mrow2 = MathJax.HTML.Element('mrow', { id: id() })
    msub.appendChild(mrow1)
    msub.appendChild(mrow2)
    add(msub, current)
    update(mrow1, math)
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
      const d = Math.sqrt(
        Math.pow(data.x - x, 2) 
        + Math.pow(data.y - y, 2)
      )
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

  // Initialization flow

  MathJax.Hub.processSectionDelay = 0
  target.appendChild(ui.container())
  update(math, math)

  return api
}