<template>
  <div>
    <math>
      <msqrt>
        <mrow>
          <mn>2</mn>
        </mrow>
      </msqrt>
      <mo>=</mo>
      <mn>1</mn>
      <mo>.</mo>
      <mn>4</mn>
    </math>
  </div>
</template>

<script>
  export default {
    created() {
      const mathJaxScript = document.createElement('script')
      mathJaxScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML'
      mathJaxScript.onload = () => {
        console.log('opa!')
      }
      document.body.appendChild(mathJaxScript)
    }
  }
</script>