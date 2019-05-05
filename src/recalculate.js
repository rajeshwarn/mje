import each from './each'

export default function recalculate(math) {
  const path = []
  let previous = null
  each(math, source => {
    const element = document.getElementById(source.id)
    const rect = element.getBoundingClientRect();

    if (path.length) {
      path[path.length - 1].next = source
    }

    switch (source.tagName) {
    case 'MATH':
    case 'MROW':
      path.push({
        x: rect.width + rect.left,
        y: rect.top,
        height: rect.height,
        source,
        previous
      })
      previous = source
      return

    default:
      path.push({
        x: rect.left,
        y: rect.top,
        height: rect.height,
        source,
        previous
      })
      previous = source
      return
    }
  })
  return path
}