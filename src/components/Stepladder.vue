<template>
  <div class="hello">

    테스트
  </div>
</template>

<script>
import {onMounted} from "vue";

export default {
  name: 'Stepladder',
  props: {
  },
  setup(){
    const getStepladder = () => {}

    onMounted(getStepladder)
    // watch(value, methods)
    return {}
  },
  data() {
    return {}
  },
  computed: {},
}
</script>
<style lang="scss" scoped>
</style>
