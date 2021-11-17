<template>
  <header class="game-header" :style="{color: props.color ? `#${props.color}` : '#c4c4c4'}">
    <h1>{{ props.title }}</h1>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return {props};
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/base/layout.scss';
</style>