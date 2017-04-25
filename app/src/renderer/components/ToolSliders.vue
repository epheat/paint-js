<!-- epheat
CS 498 Group 3
Paint.js -->

<template>
  <div class="tool-controllers">
    <template v-for="(value, key, index) in toolProperties">
      <input class="brightness-slider" type="range" v-model="toolProperties[key]" min="1" max="99" > {{ key }} : {{ value }} <br>
    </template>
  </div>
</template>

<script>
export default {
  // props are local variables that receive changes from the parent element
  props: ['toolProperties'],

  // in components, data must be a function, to keep local variables separate
  data: function() {
    return {

    }
  },
}
</script>

<style>

</style>
