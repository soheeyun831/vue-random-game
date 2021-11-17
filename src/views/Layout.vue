<template>
  <div class="bbosong-layout">
    <div class="bbosong-contents">
      <router-view v-slot="{Component}">
        <suspense>
          <component :is="Component"/>
        </suspense>
      </router-view>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Footer
  from "@/components/layout/Footer";

export default {
  name: "Layout",
  components: {Footer}
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/base/layout.scss';
</style>