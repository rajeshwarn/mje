import del from './del'

/**
 * Perform a backspace deletion relative to current cursor position.
 * @param {HTMLElement} current 
 * @return {HTMLElement} New cursor position.
 */
export default function backspace(value, current) {
  const parent = current.parentNode
  const previous = current.previousElementSibling

  switch (current.tagName) {
  case 'MROW':
  case 'MATH':
    if (current.lastElementChild) {
      return del(value, current.lastElementChild)
    }
    if (current.tagName === 'MATH') {
      return current
    }
    return del(value, parent)
  }
  if (!previous && parent.tagName === 'MATH') {
    return current
  }
  return del(value, previous || parent)
}