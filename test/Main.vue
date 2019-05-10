<template>
  <div>
    <h1>MathJax Editor Neo</h1>
    <div id="target"></div>
  </div>
</template>

<script>
  import mjs from '../src/index'

  export default {
    mounted() {
      const mathJaxScript = document.createElement('script')
      mathJaxScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML'
      mathJaxScript.onload = () => {
        const target = document.getElementById('target')
        window.editor = mjs(target)
      }
      document.body.appendChild(mathJaxScript)
    }
  }
</script>

<style>
  body {
    font-size: 32px;
  }

  .mje-container {
    border: 1px solid #ccc;
    padding: 1em;
  }

  .mje-container.focused {
    border-color: #007fff;
  }

  .mje-container * {
    outline: none !important;
  }

  .mje-cursor {
    background-color: #000;
    position: absolute;
    width: 1px;
  }

  .mje-input {
    opacity: 0;
    height: 0;
    width: 0;
    padding: 0;
    border: none;
  }

  .mje-placeholder {
    color: #ccc;
  }
</style>