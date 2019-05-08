/**
 * Perform a delete relative to current cursor position.
 * @param {HTMLElement} current 
 * @return {HTMLElement} New cursor position.
 */
export default function del(value, current) {
  const parent = current.parentNode
  
  switch (current.tagName) {
  case 'MROW':
    return del(value, parent)

  case 'MATH':
    return current
  }

  const to = (
    current.nextElementSibling || parent
  )

  parent.removeChild(current)

  return to
}