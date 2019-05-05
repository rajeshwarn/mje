export default function each(source, handler) {
  const walk = el => {
    if (el.tagName !== 'MROW' && el.tagName !== 'MATH') {
      handler(el)
    }
    if (el.children) {
      const len = el.children.length
      for (let i = 0; i < len; i++) {
        walk(el.children[i])
      }
    }
    if (el.tagName === 'MROW' || el.tagName === 'MATH') {
      handler(el)
    }
  }
  walk(source)
}