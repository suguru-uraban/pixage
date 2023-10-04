<template>
  <transition name="fade">
    <Modal v-if="modalType === 'isNotSignIn'">
      <div class="isNotSignInModal">
        <p class="isNotSignInModal__title">{{ $t('isNotSignIn.title') }}</p>
        <p class="isNotSignInModal__caption">
          {{ $t('isNotSignIn.caption1') }}
        </p>
        <p class="isNotSignInModal__caption">
          {{ $t('isNotSignIn.caption2') }}
        </p>
        <div class="isNotSignInModal__inputButtonArea">
          <nuxt-link to="/signin" class="isNotSignInModal__inputButton signin">
            {{ $t('isNotSignIn.link1') }}
          </nuxt-link>
          <nuxt-link to="/signup" class="isNotSignInModal__inputButton signup">
            {{ $t('isNotSignIn.link2') }}
          </nuxt-link>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  components: {
    Modal,
  },
  setup() {
    /** Inject **/
    const { modalType } = inject(ModalKey) as ModalStore
    /** /Inject **/

    return {
      modalType,
    }
  },
})
</script>

<style lang="scss" scoped>
.isNotSignInModal {
  position: relative;
  &__title {
    margin-bottom: 16px;
    color: $font-color-white;
    line-height: 1.8;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__caption {
    margin-top: 16px;
    padding: 0 8px;
    color: $font-color-white;
  }
  &__inputButtonArea {
    padding-top: 32px;
    text-align: center;
  }
  &__inputButton {
    margin: 0 auto 16px;
    height: 40px;
    color: $font-color-darkgray;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &.signup {
      color: $font-color-white;
      border: $button-color-singUp-border solid 1px;
      background: $button-color-singUp-bg;
    }
    &.signin {
      color: $font-color-darkgray;
      border: $button-color-normal-border solid 1px;
      background: $button-color-normal-bg;
    }
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
}
.pc {
  .isNotSignInModal {
    width: 400px;
    &__inputButton {
      width: 300px;
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
.sp {
  .isNotSignInModal {
    width: 100%;
    &__inputButton {
      width: 100%;
      font-size: 1.3rem;
      &:active {
        opacity: 0.6;
      }
    }
  }
}
</style>
