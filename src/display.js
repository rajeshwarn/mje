import each from './each'
import id from './id'

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
    switch (source.tagName) {
    case 'MROW':
    case 'MATH':
      if (!source.children.length) {
        source.appendChild(MathJax.HTML.Element('mi', { className: 'mje-quote' }, ['?']))
      }
      if (source.tagName !== 'MATH') {
        source.appendChild(mspace())
      }
      break
    }
  })
  return displayed.outerHTML
}