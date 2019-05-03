export default function each(source, handler) {
  const walk = el => {
    if (el.children) {
      const len = el.children.length
      for (let i = 0; i < len; i++) {
        walk(el.children[i])
      }
    }
    handler(el)
  }
  walk(source)
}