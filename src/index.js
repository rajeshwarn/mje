import each from './each'
import del from './del'
import backspace from './backspace'
import display from './display'
import add from './add'
import recalculate from './recalculate'
import dom from './dom'
import id from './id'

export default function mje(target) {
  const math = MathJax.HTML.Element('math', { id: id() })
  const ui = dom()
  let current = math
  let pos = null
  let path = null

  const update = to => {
    if (to) {
      current = to
    }
    ui.value(display(math)).then(() => {
      path = recalculate(math)
      pos = path.find(predicate => predicate.source === current)
      ui.draw(pos)
    })
  }
  
  target.appendChild(ui.input())
  update()
  
  return {
    path() {
      return path
    },

    right() {
      update(pos.next)
    },

    left() {
      update(pos.previous)
    },

    del() {
      update(del(math, current))
    },

    backspace() {
      update(backspace(math, current))
    },

    number(n) {
      const mn = MathJax.HTML.Element('mn', { id: id() }, [n])
      add(mn, current)
      update()
    },

    sqrt() {
      const msqrt = MathJax.HTML.Element('msqrt', { id: id() })
      const mrow = MathJax.HTML.Element('mrow', { id: id() })
      msqrt.appendChild(mrow)
      add(msqrt, current)
      update(mrow)
    }
  }
}