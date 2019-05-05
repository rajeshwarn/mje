import each from './each'

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