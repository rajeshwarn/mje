export default function ui() {
  const input = MathJax.HTML.Element('div', { className: 'mje-input' })
  const cursor = MathJax.HTML.Element('div', { className: 'mje-cursor' })
  let jax = null
  
  document.body.appendChild(cursor)

  return {
    input() {
      return input
    },

    value(newValue) {
      return new Promise(resolve => {
        if (jax) {
          return jax.Text(newValue, resolve)
        }
        input.innerHTML = newValue
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, input, () => {
          jax = MathJax.Hub.getAllJax(input)[0]
          resolve()
        }])
      })
    },

    draw(data) {
      console.log(data)
      cursor.style.left = `${data.x}px`
      cursor.style.top = `${data.y}px`
      cursor.style.height = `${data.height}px`
    }
  }
}