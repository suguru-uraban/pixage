<template>
  <transition name="fade">
    <Modal v-if="modalType === 'isNotVerified'">
      <div class="isNotVerifiedModal">
        <p class="isNotVerifiedModal__title">{{ $t('isNotVerified.title') }}</p>
        <p class="isNotVerifiedModal__caption">
          {{ $t('isNotVerified.caption') }}
        </p>
        <div class="isNotVerifiedModal__inputButtonArea">
          <button class="isNotVerifiedModal__inputButton signin" @click="sendVerifyEmail">
            {{ $t('isNotVerified.link') }}
          </button>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { defineComponent, inject, useRouter } from '@nuxtjs/composition-api'
import { auth } from '@/plugins/firebase'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  components: {
    Modal,
  },
  setup() {
    /** composition-api **/
    const router = useRouter()
    /** /composition-api **/

    /** Inject **/
    const { modalType } = inject(ModalKey) as ModalStore
    /** /Inject **/

    /** Function **/
    // 認証メールを送った後、送信完了ページへ遷移
    const sendVerifyEmail = () => {
      auth.currentUser?.sendEmailVerification()
      router.push('/verify-sendmail')
    }
    /** /Function **/

    return {
      modalType,
      sendVerifyEmail,
    }
  },
})
</script>

<style lang="scss" scoped>
.isNotVerifiedModal {
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
    &:hover {
      opacity: 0.6;
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
  .isNotVerifiedModal {
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
  .isNotVerifiedModal {
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
