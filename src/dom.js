export default function ui() {
  const input = MathJax.HTML.Element('div', { class: 'mje-input' })
  let jax = null

  return {
    value(newValue) {
      return new Promise(resolve => {
        if (jax) {
          return jax.Text(newValue, resolve)
        }
        input.innerHTML = newValue
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, node, () => {
          jax = MathJax.Hub.getAllJax(node)[0]
          resolve()
        }])
      })
    },


  }
}