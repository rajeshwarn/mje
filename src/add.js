/**
 * Add an element next to the current cursor positon.
 * @param {HTMLElement} what 
 * @param {HTMLElement} source 
 * @return {Boolean}
 */
export default function add(what, source) {
  switch (source.tagName) {
  case 'MROW':
  case 'MATH':
    if (!source.children.length) {
      source.appendChild(what)
      return true
    }
    source.insertBefore(what, source.lastElementChild.nextSibling)
    return true

  default:
    source.parentNode.insertBefore(what, source)
    return true
  }
}