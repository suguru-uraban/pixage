<template>
  <transition name="fade">
    <div class="footerMenu">
      <nuxt-link v-if="path !== '/'" to="/" class="footerMenu__menuLink">
        <font-awesome-icon :icon="['fas', 'home']" />
      </nuxt-link>
      <span v-else class="footerMenu__menuActive">
        <font-awesome-icon :icon="['fas', 'home']" />
      </span>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.footerMenu {
  padding: 0 16px;
  width: 100%;
  height: calc(56px + env(safe-area-inset-bottom));
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  justify-content: space-around;
  background: $background-color-header;
  z-index: $zIndexMenu;
  &__icon {
    width: 56px;
    height: 56px;
    font-size: 2.2rem;
    color: $font-color-white;
    line-height: 56px;
    text-align: center;
  }
  &__menuLink,
  &__menuActive {
    width: 56px;
    height: 56px;
    font-size: 2.2rem;
    color: $font-color-gray;
    line-height: 56px;
    text-align: center;
    display: block;
  }
  &__menuLink {
    color: $font-color-gray;
  }
  &__menuActive {
    color: $font-color-red;
  }
}
</style>
