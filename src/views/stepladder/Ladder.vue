<template>
  <div>
    사다리타기 테스트
    {{members}}
    {{gifts}}
  </div>
</template>

<script>
import {computed, onMounted} from "vue";
import {useStore} from 'vuex';

export default {
  name: 'Stepladder',
  setup() {
    const store = useStore();
    const members = computed(() => store.state.member);
    const gifts = computed(() => store.state.gift);


    const getStepladder = () => {
    }

    onMounted(getStepladder)
    // watch(value, methods)
    return {members, gifts}
  },
  data() {
    return {}
  },
  computed: {},
}
</script>
<style lang="scss" scoped>
</style>
