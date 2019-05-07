export default function view() {
  /** @type {HTMLElement} */
  const container = MathJax.HTML.Element('div', { className: 'mje-container' })
  /** @type {HTMLElement} */
  const cursor = MathJax.HTML.Element('div', { className: 'mje-cursor' })
  /** @type {HTMLElement} */
  const input = MathJax.HTML.Element('input', { className: 'mje-input' })

  /** @type {Object} MathJax's Jax element. */
  let jax = null
  /** @type {Boolean} Focus state of the controller. */
  let focused = false
  /** @type {Boolean} Hover state of the controller */
  let hover = false
  /** @type {Object} Event handlers of the controller. */
  let events = {
    click: null,
    input: null,
    code: null
  }
  
  /**
   * Update the user interface.
   * @return {Void}
   */
  const update = () => {
    if (focused) {
      container.classList.add('focused')
    }
    else {
      container.classList.remove('focused')
    }
  }

  /**
   * Handle outside UI bounds clicks.
   * @return {Void}
   */
  const handleOutsideClick = () => {
    console.log(hover)
    if (!hover) {
      focused = false
      input.blur()
      return update()
    }
  }

  /**
   * Handle inside UI bounds clicks.
   * @param {MouseEvent} e 
   * @return {Void}
   */
  const handleInsideClick = e => {
    focused = true
    events.click(e.clientX, e.clientY)
    input.focus()
    update()
  }

  /**
   * Handle UI mouseenter event.
   * @return {Void}
   */
  const handleMouseEnter = () => {
    hover = true
  }

  /**
   * Handle UI mouseleave event.
   * @return {Void}
   */
  const handleMouseLeave = () => {
    hover = false
  }

  /**
   * Handle input blur event.
   * @return {Void}
   */
  const handleBlur = () => {
    if (!hover) {
      focused = false
      return update()
    }
    input.focus()
    return update()
  }

  /**
   * Handle input event.
   * @return {Void}
   */
  const handleInput = () => {
    if (!input.value.length) {return}
    events.input(input.value)
    input.value = ''
  }

  /**
   * Handle input keydown event.
   * @param {KeyboardEvent} e
   * @return {Void}
   */
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

    /**
     * Get the main container.
     * @return {HTMLElement}
     */
    container() {
      return container
    },

    /**
     * Set display mathematics.
     * @param {HTMLElement} val 
     */
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

    /**
     * Draw cursor.
     * @param {Object} data 
     */
    draw(data) {
      console.log(data)
      cursor.style.left = `${data.x}px`
      cursor.style.top = `${data.y}px`
      cursor.style.height = `${data.height}px`
    }
  }
}