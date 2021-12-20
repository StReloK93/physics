<template>
  <div class="h-full">
    <canvas ref="canvas" class="w-full h-full"></canvas>
  </div>
</template>

<script>
import Canvas from '@/scene/canvas'

export default {
  mounted(){
    Canvas(this.$refs.canvas)
  }
}
</script>

<style>
.w-full{
  width: 100%;
}
.h-full{
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  overflow: hidden;
}
</style>
