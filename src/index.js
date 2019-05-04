import each from './each'
import del from './del'
import backspace from './backspace'
import add from './add'
import recalculate from './recalculate'
import dom from './dom'
import id from './id'

export default function mje() {
  const math = MathJax.HTML.Element('math', { id: id() })
  const ui = dom()
  let current = math

  ui.value(display(math))

  return {
    addNumber(n) {
      const mn = MathJax.HTML.Element('mn', { id: id() }, [n])
      add(n, current)
      //recalculate()
    }
  }
}