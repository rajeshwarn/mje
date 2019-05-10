import each from './each'
import lower from './lower'

/**
 * Get the viewport coordinates of draw mathematics by MathJax.
 * This will then be used to draw the cursor.
 * @param {HTMLElement} math 
 */
export default function recalculate(math) {
  const cache = {}
  /** @type {Array} */
  const path = []
  /** @type {HTMLElement} */
  let previous = null
  /** @type {Object} */
  let prevData = null

  const bounding = (element, id) => {
    if (!element) {return}
    if (!cache.hasOwnProperty(id)) {
      cache[id] = element.getBoundingClientRect()
    }
    return cache[id]
  }

  each(math, source => {
    const element = document.getElementById(source.id)
    if (!element) {return}
    const has = source.children.length
    const last = element.lastElementChild
    const parent = source.parentNode
    const tag = lower(source.tagName)
    const rect = bounding(element, source.id)
    let parentElement
    let parentRect
    const data = {
      y: rect.top,
      height: rect.height,
      source,
      previous
    }

    if (parent && tag !== 'mrow') {
      parentElement = document.getElementById(parent.id)
      parentRect = bounding(parentElement, parent.id)
      data.y = parentRect.top
      data.height = parentElement.clientHeight
    }

    if (prevData) {
      prevData.next = source
    }

    switch (lower(tag)) {
    case 'math':
      data.x = (has ? rect.width : 0) + rect.left
      break

    case 'mrow':
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