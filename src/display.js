import each from './each'

/**
 * Get the editor value as a HTML string.
 * @param {HTMLElement} math 
 * @return {String}
 */
export default function display(math) {
  const displayed = math.cloneNode(true)
  each(displayed, source => {
    switch (source.tagName) {
    case 'MROW':
    case 'MATH':
      if (!source.children.length) {
        source.appendChild(MathJax.HTML.Element('mi', {}, ['?']))
      }
    }
  })
  return displayed.outerHTML
}