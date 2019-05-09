import lower from './lower'

/**
 * Walk through each element within a math element.
 * @param {HTMLElement} source 
 * @param {Function} handler 
 */
export default function each(source, handler) {
  const walk = el => {
    const isContainer = (
      lower(el.tagName) === 'mrow'
      || lower(el.tagName) === 'math'
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