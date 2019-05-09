import del from './del'
import lower from './lower'

/**
 * Perform a backspace deletion relative to current cursor position.
 * @param {HTMLElement} current 
 * @return {HTMLElement} New cursor position.
 */
export default function backspace(value, current) {
  const parent = current.parentNode
  const previous = current.previousElementSibling
  const tag = lower(current.tagName)

  switch (tag) {
  case 'mrow':
  case 'math':
    if (current.lastElementChild) {
      return del(value, current.lastElementChild)
    }
    if (tag === 'math') {
      return current
    }
    return del(value, parent)
  }

  if (!previous && lower(parent.tagName) === 'math') {
    return current
  }
console.log('yey')
  return del(value, previous || parent)
}