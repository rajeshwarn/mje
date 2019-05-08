import each from './each'

/**
 * Get the viewport coordinates of draw mathematics by MathJax.
 * This will then be used to draw the cursor.
 * @param {HTMLElement} math 
 */
export default function recalculate(math) {
  /** @type {Array} */
  const path = []
  /** @type {HTMLElement} */
  let previous = null
  /** @type {Object} */
  let prevData = null

  each(math, source => {
    const element = document.getElementById(source.id)
    const rect = element.getBoundingClientRect()
    const has = source.children.length
    const last = element.lastElementChild
    const data = {
      y: rect.top,
      height: rect.height,
      source,
      previous
    }

    if (prevData) {
      prevData.next = source
    }

    switch (source.tagName) {
    case 'MATH':
      data.x = (has ? rect.width : 0) + rect.left
      break

    case 'MROW':
      data.x = (has ? rect.width - last.clientWidth : 0) + rect.left
      break

    default:
      data.x = rect.left
      break
    }

    path.push(data)
    previous = source
    prevData = data
  })
  
  return path
}