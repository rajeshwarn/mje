import each from './each'
import id from './id'
import lower from './lower'

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
      }
      if (tag !== 'math') {
        source.appendChild(mspace())
      }
      break
    }
  })
  return displayed.outerHTML
}