<template>
  <div class="modal">
    <div class="modal__overlay" @click.self="handleOpenModal('noModal')">
      <button class="modal__close" @click="handleOpenModal('noModal')">
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
      <div id="modal" class="modal__body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onBeforeUnmount } from '@nuxtjs/composition-api'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'

export default defineComponent({
  setup(_, ctx) {
    /** Inject **/
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    /** /Inject **/

    /** LifeCycle **/
    onMounted(() => {
      const modal = document.getElementById('modal')
      if (modal) {
        disableBodyScroll(modal)
      }
    })

    onBeforeUnmount(() => {
      ctx.emit('reset-input')
      clearAllBodyScrollLocks()
    })
    /** /LifeCycle **/

    return {
      handleOpenModal,
    }
  },
})
</script>

<style lang="scss" scoped>
.modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: $zIndexModal;
  &__overlay {
    width: 100%;
    height: 100%;
    text-align: center;
    background: $background-color-overlay;
    &:before {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
      margin-right: -0.25em;
    }
  }
  &__body {
    margin: auto;
    min-width: 164px;
    min-height: 164px;
    max-height: calc(90% - 64px);
    text-align: left;
    vertical-align: middle;
    display: inline-block;
    border-radius: 4px;
    background: $background-color-gray-opacity;
    overflow-y: auto;
  }
  &__close {
    width: 32px;
    height: 32px;
    color: $font-color-white;
    text-align: center;
    position: absolute;
  }
}
.pc {
  .modal {
    &__body {
      padding: 32px;
      max-width: calc(90% - 64px);
    }
    &__close {
      font-size: 3.2rem;
      top: 32px;
      right: 32px;
    }
  }
}
.sp {
  .modal {
    &__body {
      padding: 32px 16px;
      width: calc(100% - 32px);
    }
    &__close {
      font-size: 2.4rem;
      top: 16px;
      right: 8px;
    }
  }
}
</style>
