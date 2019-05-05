import del from './del'

/**
 * 
 * @param {HTMLElement} current 
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