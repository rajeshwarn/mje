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
  .mje-input {
    padding: 1em;
  }

  .mje-cursor {
    background-color: #000;
    position: absolute;
    width: 1px;
  }
</style>