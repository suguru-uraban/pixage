<template>
  <transition name="fade">
    <Modal v-if="modalType === 'displayNameEdit'" @reset-input="resetInputDisplayName">
      <div class="displayNameEditModal">
        <p class="displayNameEditModal__title">{{ $t('displayName.title') }}</p>
        <dl class="displayNameEditModal__inputArea">
          <dd class="displayNameEditModal__inputBlock">
            <input
              v-model="newDisplayName"
              type="text"
              :placeholder="$t('displayName.placeholder')"
              :class="[
                'displayNameEditModal__inputText',
                { inValid: isDirty.newDisplayName && params.newDisplayName.$anyInvalid },
              ]"
              @focus="resetValidateDisplayName"
            />
            <Error
              v-if="
                isDirty.newDisplayName &&
                params.newDisplayName.$dirty &&
                params.newDisplayName.required.$invalid
              "
              :message="params.newDisplayName.required.$message"
              type="input"
            />
            <Error
              v-if="
                isDirty.newDisplayName &&
                params.newDisplayName.$dirty &&
                params.newDisplayName.format.$invalid
              "
              :message="params.newDisplayName.format.$message"
              type="input"
            />
          </dd>
        </dl>
        <div class="displayNameEditModal__buttonArea">
          <Error
            v-if="errorMessageDisplayName !== ''"
            :message="errorMessageDisplayName"
            type="modalTotal"
          />
          <button class="displayNameEditModal__editButton" @click="clickEditDisplayName">
            {{ $t('displayName.edit') }}
          </button>
          <div class="displayNameEditModal__cancelLinkWrap">
            <p class="displayNameEditModal__cancelLink" @click="clickCancelDisplayName">
              {{ $t('displayName.cancel') }}
            </p>
          </div>
        </div>
        <ul class="displayNameEditModal__attentionList">
          <li class="displayNameEditModal__attentionListParts">
            {{ $t('displayName.attention1') }}
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
      newDisplayName,
      errorMessageDisplayName,
      isDirty,
      params,
      initVariables,
      editDisplayName,
      resetValidateDisplayName,
      resetInputDisplayName,
    } = inject(EditMyPageKey) as EditMyPageStore
    /** /Inject **/

    /** Function **/
    // ボタンをクリックしてバリデーションが通ったら表示名を編集する
    const clickEditDisplayName = async () => {
      if (!params.newDisplayName.$anyInvalid) {
        editDisplayName(state)
        watch(processing, () => {
          if (!processing.value) {
            handleOpenModal('noModal')
          }
        })
      } else {
        isDirty.newDisplayName = true
        return await params.$touch()
      }
    }

    // キャンセルしてモーダルを閉じる
    const clickCancelDisplayName = () => {
      resetInputDisplayName()
      processing.value = false
      initVariables()
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      modalType,
      handleOpenModal,
      newDisplayName,
      errorMessageDisplayName,
      isDirty,
      params,
      resetValidateDisplayName,
      resetInputDisplayName,
      clickEditDisplayName,
      clickCancelDisplayName,
    }
  },
})
</script>

<style lang="scss" scoped>
.displayNameEditModal {
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
  .displayNameEditModal {
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
  .displayNameEditModal {
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
