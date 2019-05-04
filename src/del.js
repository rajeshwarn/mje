/**
 *    
 * @param {HTMLElement} source 
 */
export default function del(source) {
  switch (source.tagName) {
  case 'mrow':
    return del(source.parentNode)
  
  case 'math':
    return false
  
  default:
    source.parentElement.removeChild(source)
  }
  return true
}