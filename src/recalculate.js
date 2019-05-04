export default function recalculate(math) {
  const positions = []
  each(math, source => {
    const element = document.getElementById(source.id)
    const rect = element.getBoundingClientRect();
    switch (source.tagName) {
    case 'math':
    case 'mrow':
      return positions.push({
        x: rect.width + rect.left,
        y: rect.top,
        height: rect.height,
        source
      })

    default:
      return positions.push({
        x: rect.left,
        y: rect.top,
        height: rect.height,
        source
      })
    }
  })
  return positions
}