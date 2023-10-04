<template>
  <div id="search" class="search">
    <button class="search__icon" @click="handleOpenSearchMenu">
      <font-awesome-icon :icon="['fas', 'search']" />
    </button>
    <transition name="fade">
      <div v-if="isOpenSearchMenu" class="search__back">
        <div class="search__body">
          <div class="search__input">
            <input type="text" value="" :placeholder="$t('header.searchPlaceholder')" />
          </div>
          <div class="search__buttonGroup">
            <button class="search__button"><font-awesome-icon :icon="['fas', 'search']" /></button>
            <button class="search__button" @click="handleOpenSearchMenu">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUpdated } from '@nuxtjs/composition-api'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { useSearch } from '@/compositions/search'

export default defineComponent({
  setup() {
    /** composition-api **/
    const { isOpenSearchMenu, handleOpenSearchMenu } = useSearch()
    /** /composition-api **/

    /** LifeCycle **/
    onUpdated(() => {
      const search = document.getElementById('search')
      if (isOpenSearchMenu.value) {
        disableBodyScroll(search!)
      } else {
        clearAllBodyScrollLocks()
      }
    })
    /** /LifeCycle **/

    return {
      isOpenSearchMenu,
      handleOpenSearchMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.search {
  z-index: $zIndexModal;
  &__icon {
    width: 56px;
    height: 56px;
    font-size: 2.2rem;
    color: $font-color-gray;
    line-height: 56px;
    text-align: center;
  }
  &__back {
    margin: auto;
    text-align: left;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $background-color-overlay;
    z-index: $zIndexMobileOverlay;
  }
  &__body {
    height: 56px;
    display: flex;
    position: relative;
    background: $background-color-header;
  }
  &__buttonGroup {
    width: 112px;
    height: 56px;
    display: flex;
  }
  &__button {
    width: 56px;
    height: 56px;
    font-size: 2.2rem;
    color: $font-color-white;
    line-height: 56px;
    text-align: center;
  }
  &__input {
    padding: 8px 4px 8px 16px;
    flex: 1;
    input[type='text'] {
      padding: 8px 16px;
      width: 100%;
      height: 40px;
      font-size: 1.8rem;
      color: $font-color-white;
      border-radius: 20px;
      background: $background-color-gray-opaque;
    }
  }
}
::placeholder {
  color: $font-color-lightgray;
}
</style>
