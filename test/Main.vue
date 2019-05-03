<template>
  <div>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML' async @load="setup"></script>
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
    methods: {
      setup() {
        console.log('ready to go.')
      }
    }
  }
</script>