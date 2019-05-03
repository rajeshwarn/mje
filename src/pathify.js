export default function pathify(source) {
  const path = []
  const walk = el => {
    if (el.children) {
      const len = el.children.length
      for (let i = 0; i < len; i++) {
        walk(el.children[i])
      }
    }
    path.push(el)
  }
  walk(source)
  return path
}