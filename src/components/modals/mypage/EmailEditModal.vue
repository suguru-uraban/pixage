<template>
  <transition name="fade">
    <Modal v-if="modalType === 'emailEdit'" @reset-input="resetInputEmail">
      <div class="emailEditModal">
        <p class="emailEditModal__title">{{ $t('email.title') }}</p>
        <dl class="emailEditModal__inputArea">
          <dd class="emailEditModal__inputBlock">
            <input
              v-model="newEmail"
              type="text"
              :placeholder="$t('email.placeholder')"
              :class="[
                'emailEditModal__inputText',
                { inValid: isDirty.newEmail && params.newEmail.$anyInvalid },
              ]"
              @focus="resetValidateEmail"
            />
            <Error
              v-if="isDirty.newEmail && params.newEmail.$dirty && params.newEmail.required.$invalid"
              :message="params.newEmail.required.$message"
              type="input"
            />
            <Error
              v-if="isDirty.newEmail && params.newEmail.$dirty && params.newEmail.format.$invalid"
              :message="params.newEmail.format.$message"
              type="input"
            />
          </dd>
        </dl>
        <div class="emailEditModal__buttonArea">
          <Error v-if="errorMessageEmail !== ''" :message="errorMessageEmail" type="modalTotal" />
          <button class="emailEditModal__editButton" @click="clickEditEmail">
            {{ state.provider.value === 'password' ? $t('email.verify') : $t('email.edit') }}
          </button>
          <div class="emailEditModal__cancelLinkWrap">
            <p class="emailEditModal__cancelLink" @click="clickCancelEmail">
              {{ $t('email.cancel') }}
            </p>
          </div>
        </div>
        <ul class="emailEditModal__attentionList">
          <li class="emailEditModal__attentionListParts">
            {{ $t('email.attention1') }}
          </li>
        </ul>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { defineComponent, inject, watch } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { EditMyPageKey } from '@/compositions/key/editMyPageKey'
import { EditMyPageStore } from '@/compositions/editMyPage'
import Modal from '@/components/Modal.vue'
import Error from '@/components/shared/Error.vue'
import { injectGlobalState } from '@/utils/states/user'

export default defineComponent({
  components: {
    Modal,
    Error,
  },
  setup() {
    /** Inject **/
    const state = injectGlobalState()
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      processing,
      newEmail,
      errorMessageEmail,
      isDirty,
      params,
      initVariables,
      editEmail,
      resetValidateEmail,
      resetInputEmail,
    } = inject(EditMyPageKey) as EditMyPageStore
    /** /Inject **/

    /** Function **/
    // ボタンをクリックしてバリデーションが通ったらメールアドレスを編集する
    const clickEditEmail = async () => {
      if (!params.newEmail.$anyInvalid) {
        editEmail(state)
        watch(processing, () => {
          if (!processing.value) {
            handleOpenModal('noModal')
          }
        })
      } else {
        isDirty.newEmail = true
        return await params.$touch()
      }
    }

    // キャンセルしてモーダルを閉じる
    const clickCancelEmail = () => {
      resetInputEmail()
      processing.value = false
      initVariables()
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      state,
      modalType,
      handleOpenModal,
      newEmail,
      errorMessageEmail,
      isDirty,
      params,
      resetValidateEmail,
      resetInputEmail,
      clickEditEmail,
      clickCancelEmail,
    }
  },
})
</script>

<style lang="scss" scoped>
.emailEditModal {
  position: relative;
  &__title {
    margin-bottom: 16px;
    line-height: 1.8;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__image {
    margin: 0 auto 16px;
    padding: 2px;
    width: 126px;
    height: 126px;
    position: relative;
    border: $border-color-lightgray solid 1px;
  }
  &__inputArea {
    margin-bottom: 24px;
    padding: 0 8px;
  }
  &__inputBlock {
    padding-bottom: 16px;
    position: relative;
  }
  &__inputTitle {
    margin-bottom: 8px;
  }
  &__inputText {
    padding: 4px;
    width: 100%;
    height: 40px;
    font-size: 1.6rem;
    color: $font-color-darkgray;
    border-radius: 4px;
    border: $border-color-gray solid 1px;
    background: $background-color-white;
    &.inValid {
      border: $border-color-red solid 1px;
      background: $background-color-pink;
    }
  }
  &__buttonArea {
    position: relative;
  }
  &__editButton {
    margin: 0 auto 16px;
    padding: 0 16px;
    min-width: 120px;
    height: 40px;
    color: $font-color-darkgray;
    text-align: center;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:hover {
      opacity: 0.6;
    }
  }
  &__cancelLinkWrap {
    margin: 0 auto 16px;
    text-align: center;
  }
  &__cancelLink {
    text-decoration: underline;
    display: inline-block;
    cursor: pointer;
    &:hover {
      text-decoration: none;
    }
  }
  &__attentionList {
    padding-left: 1.2rem;
    text-indent: -1rem;
  }
  &__attentionListParts {
    margin-bottom: 8px;
    font-size: 1.2rem;
    line-height: 1.4;
    &:before {
      content: '※';
    }
  }
}
.pc {
  .emailEditModal {
    width: 400px;
    &__editButton {
      &:hover {
        opacity: 0.6;
      }
    }
    &__cancelLink {
      &:hover {
        text-decoration: none;
      }
    }
  }
}
.sp {
  .emailEditModal {
    width: 100%;
    &__editButton {
      &:active {
        opacity: 0.6;
      }
    }
    &__cancelLink {
      &:active {
        text-decoration: none;
      }
    }
  }
}
</style>
