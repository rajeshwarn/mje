export default function view() {
  const container = MathJax.HTML.Element('div', { className: 'mje-container' })
  const cursor = MathJax.HTML.Element('div', { className: 'mje-cursor' })
  /** @type {HTMLElement} */
  const input = MathJax.HTML.Element('input', { className: 'mje-input' })

  let jax = null
  let focused = false
  let hover = false
  let events = {
    click: null,
    input: null,
    code: null
  }
  
  const update = () => {
    if (focused) {
      container.classList.add('focused')
    }
    else {
      container.classList.remove('focused')
    }
  }

  const handleOutsideClick = () => {
    console.log(hover)
    if (!hover) {
      focused = false
      input.blur()
      return update()
    }
  }

  const handleInsideClick = e => {
    focused = true
    events.click(e.clientX, e.clientY)
    input.focus()
    update()
  }

  const handleMouseEnter = () => {
    hover = true
  }

  const handleMouseLeave = () => {
    hover = false
  }

  const handleBlur = () => {
    if (!hover) {
      focused = false
      return update()
    }
    input.focus()
    return update()
  }

  const handleInput = () => {
    if (!input.value.length) {return}
    events.input(input.value)
    input.value = ''
  }

  const handleKeydown = e => {
    events.code(e.keyCode)
  }

  document.body.appendChild(cursor)
  document.body.appendChild(input)

  document.addEventListener('click', handleOutsideClick)
  container.addEventListener('click', handleInsideClick)
  container.addEventListener('mouseenter', handleMouseEnter)
  container.addEventListener('mouseleave', handleMouseLeave)
  input.addEventListener('blur', handleBlur)
  input.addEventListener('keydown', handleInput)
  input.addEventListener('keyup', handleInput)
  input.addEventListener('keydown', handleKeydown)

  return {
    events,

    container() {
      return container
    },

    value(val) {
      return new Promise(resolve => {
        if (jax) {
          return jax.Text(val, resolve)
        }
        container.innerHTML = val
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