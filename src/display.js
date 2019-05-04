import each from './each'

export default function display(math) {
  const displayed = math.cloneNode(true)
  each(displayed, source => {
    switch (source.tagName) {
    case 'mrow':
    case 'math':
      if (!source.children.length) {
        source.appendChild(MathJax.HTML.Element('mi', {}, ['?']))
      }
    }
  })
  return displayed
}