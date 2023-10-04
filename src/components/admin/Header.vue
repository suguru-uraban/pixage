<template>
  <div class="adminHeader">
    <Logo width="auto" height="40" />
    <h1 class="adminHeader__title">管理画面<span>Ver1.0.0</span></h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Logo from '@/components/admin/Logo.vue'

export default defineComponent({
  components: {
    Logo,
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.adminHeader {
  padding: 8px 24px 8px 320px;
  width: 100vw;
  min-width: 1200px;
  height: 56px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  background: $background-color-white;
  z-index: 1;
  &__title {
    margin-left: 8px;
    font-size: 1.6rem;
    font-weight: bold;
    span {
      margin-left: 8px;
      font-weight: normal;
      display: inline-block;
    }
  }
}
</style>
