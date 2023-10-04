<template>
  <transition name="fade">
    <Modal v-if="modalType === 'nameEdit'" @reset-input="resetInputName">
      <div class="nameEditModal">
        <p class="nameEditModal__title">{{ $t('name.title') }}</p>
        <dl class="nameEditModal__inputArea">
          <dt class="nameEditModal__inputTitle">
            {{ $t('name.lastNameTitle') }}
          </dt>
          <dd class="nameEditModal__inputBlock">
            <input
              v-model="newLastName"
              type="text"
              :placeholder="$t('name.placeholder1')"
              :class="[
                'nameEditModal__inputText',
                { inValid: isDirty.newLastName && params.newLastName.$anyInvalid },
              ]"
              @focus="resetValidateName"
            />
            <Error
              v-if="
                isDirty.newLastName &&
                params.newLastName.$dirty &&
                params.newLastName.required.$invalid
              "
              :message="params.newLastName.required.$message"
              type="input"
            />
            <Error
              v-if="
                isDirty.newLastName &&
                params.newLastName.$dirty &&
                params.newLastName.format.$invalid
              "
              :message="params.newLastName.format.$message"
              type="input"
            />
          </dd>
        </dl>
        <dl class="nameEditModal__inputArea">
          <dt class="nameEditModal__inputTitle">
            {{ $t('name.firstNameTitle') }}
          </dt>
          <dd class="nameEditModal__inputBlock">
            <input
              v-model="newFirstName"
              type="text"
              :placeholder="$t('name.placeholder2')"
              :class="[
                'nameEditModal__inputText',
                { inValid: isDirty.newFirstName && params.newFirstName.$anyInvalid },
              ]"
              @focus="resetValidateName"
            />
            <Error
              v-if="
                isDirty.newFirstName &&
                params.newFirstName.$dirty &&
                params.newFirstName.required.$invalid
              "
              :message="params.newFirstName.required.$message"
              type="input"
            />
            <Error
              v-if="
                isDirty.newFirstName &&
                params.newFirstName.$dirty &&
                params.newFirstName.format.$invalid
              "
              :message="params.newFirstName.format.$message"
              type="input"
            />
          </dd>
        </dl>
        <div class="nameEditModal__buttonArea">
          <Error v-if="errorMessageName !== ''" :message="errorMessageName" type="modalTotal" />
          <button class="nameEditModal__editButton" @click="clickEditName">
            {{ $t('name.edit') }}
          </button>
          <div class="nameEditModal__cancelLinkWrap">
            <p class="nameEditModal__cancelLink" @click="clickCancelName">
              {{ $t('name.cancel') }}
            </p>
          </div>
        </div>
        <ul class="nameEditModal__attentionList">
          <li class="nameEditModal__attentionListParts">
            {{ $t('name.attention1') }}
          </li>
          <li class="nameEditModal__attentionListParts">
            {{ $t('name.attention2') }}
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
      newFirstName,
      newLastName,
      errorMessageName,
      isDirty,
      params,
      initVariables,
      editName,
      resetValidateName,
      resetInputName,
    } = inject(EditMyPageKey) as EditMyPageStore
    /** /Inject **/

    /** Function **/
    // ボタンをクリックしてバリデーションが通ったら氏名を編集する
    const clickEditName = async () => {
      if (!params.newFirstName.$anyInvalid && !params.newLastName.$anyInvalid) {
        editName(state)
        watch(processing, () => {
          if (!processing.value) {
            handleOpenModal('noModal')
          }
        })
      } else {
        if (params.newFirstName.$anyInvalid) isDirty.newFirstName = true
        if (params.newLastName.$anyInvalid) isDirty.newLastName = true
        return await params.$touch()
      }
    }

    // キャンセルしてモーダルを閉じる
    const clickCancelName = () => {
      resetInputName()
      processing.value = false
      initVariables()
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      modalType,
      handleOpenModal,
      newFirstName,
      newLastName,
      errorMessageName,
      isDirty,
      params,
      resetValidateName,
      resetInputName,
      clickEditName,
      clickCancelName,
    }
  },
})
</script>

<style lang="scss" scoped>
.nameEditModal {
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
  .nameEditModal {
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
  .nameEditModal {
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
