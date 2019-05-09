import each from './each'
import id from './id'
import lower from './lower'

const skip = ['mo', 'mi', 'mn', 'mspace'] 

/**
 * Get the editor value as a HTML string.
 * @param {HTMLElement} math 
 * @return {String}
 */
export default function display(math) {
  each(math, source => {
    if (!source.id) {
      source.id = id()
    }
  })

  const displayed = math.cloneNode(true)

  const mspace = () => {
    const el = MathJax.HTML.Element('mspace')
    el.setAttribute('width', 'thinmathspace')
    return el
  }

  each(displayed, source => {
    const tag = lower(source.tagName)
    switch (tag) {
    case 'mrow':
    case 'math':
      if (!source.children.length) {
        source.appendChild(
          MathJax.HTML.Element('mi', { className: 'mje-quote' }, ['?'])
        )
        break
      }
      if (tag !== 'math') {
        source.appendChild(mspace())
        source.insertBefore(mspace(), source.firstChild)
      }
      break
    default:
      if (skip.indexOf(tag) === -1) {
        console.log(tag)
        source.parentNode.insertBefore(mspace(), source.nextSibling)
      }
    }
  })
  return displayed.outerHTML
}