<template>
  <div class="breadcrumb">
    <ul class="breadcrumb__items">
      <li v-for="breadcrumb in breadcrumbs" :key="breadcrumb.name" class="breadcrumb__item">
        <nuxt-link v-if="breadcrumb.path" :to="breadcrumb.path" class="breadcrumb__link">{{
          breadcrumb.name
        }}</nuxt-link>
        <span v-else class="breadcrumb__text">{{ breadcrumb.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.breadcrumb {
  padding-left: 160px;
  width: 100vw;
  position: fixed;
  top: 56px;
  left: 0;
  border-top: $border-color-lightgray solid 1px;
  box-shadow: 2px 2px 2px $shadow-color;
  background: $background-color-white;
  z-index: 1;
  &__items {
    display: flex;
    align-items: center;
  }
  &__item {
    padding: 8px 16px 8px 32px;
    position: relative;
    &:before {
      width: 24px;
      height: 24px;
      content: '';
      position: absolute;
      top: 4px;
      left: -10px;
      border-top: $border-color-gray solid 1px;
      border-left: $border-color-gray solid 1px;
      transform: rotate(135deg);
    }
    &:nth-of-type(1) {
      padding: 8px 16px;
      &:before {
        content: none;
      }
    }
  }
  &__link {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
}
</style>
