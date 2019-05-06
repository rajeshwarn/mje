export default function ui() {
  const container = MathJax.HTML.Element('div', { className: 'mje-container' })
  const cursor = MathJax.HTML.Element('div', { className: 'mje-cursor' })
  const input = MathJax.HTML.Element('div', { className: 'mje-input' })

  let jax = null
  let focused = false
  let hover = false
  let events = {
    click: []
  }
  
  document.body.appendChild(cursor)

  container.addEventListener('click', e => {
    console.log(e)
    focused = true
    for (const handler of events.click) {
      handler(e.clientX, e.clientY)
    }
    input.focus()
  })

  container.addEventListener('mouseenter', e => {
    hover = true
  })

  container.addEventListener('mouseleave', e => {
    hover = false
  })

  input.addEventListener('blur', () => {
    if (!hover) {
      focused = false
    }
    else {
      input.focus()
    }
  })

  return {
    input() {
      return container
    },

    click(handler) {
      events.click.push(handler)
    },

    value(newValue) {
      return new Promise(resolve => {
        if (jax) {
          return jax.Text(newValue, resolve)
        }
        container.innerHTML = newValue
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, container, () => {
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