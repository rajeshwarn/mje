import add from './add'
import backspace from './backspace'
import del from './del'
import display from './display'
import id from './id'
import recalculate from './recalculate'
import view from './view'

export default function mje(target) {
  /** @type {Object} Public API of the library. */
  const api = {}
  /** @type {HTMLElement} Value of this instance. */
  const math = MathJax.HTML.Element('math', { id: id() })
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

  api.sqrt = () => {
    const msqrt = MathJax.HTML.Element('msqrt', { id: id() })
    const mrow = MathJax.HTML.Element('mrow', { id: id() })
    msqrt.appendChild(mrow)
    add(msqrt, current)
    update(mrow, math)
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