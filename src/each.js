/**
 * Walk through each element within a math element.
 * @param {HTMLElement} source 
 * @param {Function} handler 
 */
export default function each(source, handler) {
  const walk = el => {
    const isContainer = (
      el.tagName === 'MROW'
      || el.tagName === 'MATH'
    )

    if (!isContainer) {
      handler(el)
    }

    if (el.children) {
      const len = el.children.length
      for (let i = 0; i < len; i++) {
        walk(el.children[i])
      }
    }

    if (isContainer) {
      handler(el)
    }
  }

  walk(source)
}