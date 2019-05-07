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
    const data = {
      height: rect.height,
      source,
      previous
    }

    if (prevData) {
      prevData.next = source
    }

    switch (source.tagName) {
    case 'MATH':
    case 'MROW':
      data.x = rect.width + rect.left
      data.y = rect.top
      break

    default:
      data.x = rect.left
      data.y = rect.top
      break
    }

    path.push(data)
    previous = source
    prevData = data
  })
  
  return path
}