import lower from './lower'

/**
 * Perform a delete relative to current cursor position.
 * @param {HTMLElement} current 
 * @return {HTMLElement} New cursor position.
 */
export default function del(value, current) {
  const parent = current.parentNode
  
  switch (lower(current.tagName)) {
  case 'mrow':
    return del(value, parent)

  case 'math':
    return current
  }

  const to = current.nextElementSibling || parent
  parent.removeChild(current)
  
  return to
}