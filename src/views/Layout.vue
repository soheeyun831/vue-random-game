<template>
  <div class="bbosong-layout">
    <Header/>
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
import Header
  from "@/components/layout/Header";
import Footer
  from "@/components/layout/Footer";

export default {
  name: "Layout",
  components: {Header, Footer}
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/base/layout.scss';
</style>