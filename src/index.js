import del from './del'
import backspace from './backspace'
import display from './display'
import add from './add'
import recalculate from './recalculate'
import view from './view'
import id from './id'

export default function mje(target) {
  const math = MathJax.HTML.Element('math', { id: id() })
  const ui = view()
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
      return ui.value(display(math)).then(() => {
        path = recalculate(math)
        draw()
      })
    }
    return draw()
  }

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

  ui.events.input = (char) => {
    if (char.match(/\d/)) {
      return api.number(char)
    }
    else if (char.match(/[a-zA-Z]/)) {
      return api.identifier(char)
    }
  }

  ui.events.code = (code) => {
    console.log(code)
    switch (code) {
    case 8: return api.backspace()
    case 37: return api.left()
    case 39: return api.right()
    case 46: return api.del()
    }
  }
  
  // Remove delay for math rendering.
  MathJax.Hub.processSectionDelay = 0
  target.appendChild(ui.container())
  update(math, math)
  
  const api = {
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
      update(del(math, current), math)
    },

    backspace() {
      update(backspace(math, current), math)
    },

    number(n) {
      const mn = MathJax.HTML.Element('mn', { id: id() }, [n])
      add(mn, current)
      update(null, math)
    },

    identifier(c) {
      const mi = MathJax.HTML.Element('mi', { id: id() }, [c])
      add(mi, current)
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

  return api
}