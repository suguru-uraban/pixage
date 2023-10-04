<template>
  <div class="search">
    <span class="search__icon"><font-awesome-icon :icon="['fas', 'search']" /></span>
    <input type="text" value="" :placeholder="$t('header.searchPlaceholder')" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {},
})
</script>

<style lang="scss" scoped>
.search {
  flex: 1;
  max-width: 480px;
  height: 40px;
  position: relative;
  &__icon {
    margin: auto;
    width: 16px;
    height: 16px;
    font-size: 16px;
    color: $font-color-white;
    display: block;
    position: absolute;
    top: 0;
    left: 12px;
    bottom: 0;
    z-index: 1;
  }
  input[type='text'] {
    padding: 11px 16px 11px 36px;
    width: 100%;
    font-size: 1.8rem;
    color: $font-color-white;
    border-radius: 20px;
    background: $background-color-gray-opaque;
  }
}
::placeholder {
  color: $font-color-lightgray;
}
</style>
