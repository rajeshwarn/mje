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

  const draw = () => {
    pos = path.find(predicate => {
      return predicate.source === current
    })
    ui.draw(pos)
  }

  const update = (to, math) => {
    if (to) {
      current = to
    }
    if (math) {
      ui.value(display(math)).then(() => {
        path = recalculate(math)
        draw()
      })
    }
    else {
      draw()
    }
  }

  ui.click((x, y) => {
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
  })
  
  // Remove delay for math rendering.
  MathJax.Hub.processSectionDelay = 0
  target.appendChild(ui.input())
  update(math, math)
  
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
      update(null, math)
    },

    sqrt() {
      const msqrt = MathJax.HTML.Element('msqrt', { id: id() })
      const mrow = MathJax.HTML.Element('mrow', { id: id() })
      msqrt.appendChild(mrow)
      add(msqrt, current)
      update(mrow, math)
    }
  }
}