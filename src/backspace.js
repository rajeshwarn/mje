import del from './del'

/**
 * 
 * @param {HTMLElement} source 
 */
export default function backspace(source) {
  switch (source.tagName) {
  case 'mrow':
    return del(source.lastElementChild || source.parentNode)

  case 'math':
    if (source.lastElementChild) {
      return del(source.lastElementChild)
    }
    return false
  }
  if (!source.previousElementSibling) {
    return del(source.parentNode)
  }
  return del(source.previousElementSibling)
}
