<template>
  <transition name="fade">
    <Modal v-if="modalType === 'pictureEdit'" @reset-input="handleNewImage">
      <div class="pictureEditModal">
        <p class="pictureEditModal__title">{{ $t('picture.title') }}</p>
        <div class="pictureEditModal__image">
          <croppa
            v-model="hasPicture"
            :width="120"
            :height="120"
            :placeholder="$t('picture.placeholder')"
            :placeholder-font-size="10"
            :show-loading="true"
            :file-size-limit="200 * 1024"
            accept="image/jpeg,image/jpg,image/gif,image/png"
            :zoom-speed="20"
            canvas-color="transparent"
            remove-button-color="black"
            :remove-button-size="20"
            :prevent-white-space="true"
            @file-type-mismatch="onFileTypeMismatch"
            @file-size-exceed="onFileSizeExceed"
            @new-image-drawn="handleNewImage"
          ></croppa>
        </div>
        <div class="pictureEditModal__error">{{ errorMessagePicture }}</div>
        <button class="pictureEditModal__uploadButton" @click="clickUploadPicture">
          {{ $t('picture.upload') }}
        </button>
        <div class="pictureEditModal__cancelLinkWrap">
          <p class="pictureEditModal__cancelLink" @click="clickCancel">
            {{ $t('picture.cancel') }}
          </p>
        </div>
        <ul class="pictureEditModal__attentionList">
          <li class="pictureEditModal__attentionListParts">
            {{ $t('picture.attention1') }}
          </li>
          <li class="pictureEditModal__attentionListParts">
            {{ $t('picture.attention2') }}
          </li>
          <li class="pictureEditModal__attentionListParts">
            {{ $t('picture.attention3') }}
          </li>
        </ul>
        <dl class="pictureEditModal__operationMethod">
          <dt class="pictureEditModal__operationMethodTitle">{{ $t('picture.operationTitle') }}</dt>
          <dd class="pictureEditModal__operationMethodContent">
            {{ $t('picture.operation1') }}
          </dd>
          <dd class="pictureEditModal__operationMethodContent">
            {{ $t('picture.operation2') }}
          </dd>
        </dl>
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
import { injectGlobalState } from '@/utils/states/user'

export default defineComponent({
  components: {
    Modal,
  },
  setup() {
    /** Inject **/
    const state = injectGlobalState()
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      processing,
      hasPicture,
      errorMessagePicture,
      initVariables,
      uploadPicture,
      onFileTypeMismatch,
      onFileSizeExceed,
      handleNewImage,
    } = inject(EditMyPageKey) as EditMyPageStore
    /** /Inject **/

    /** Function **/
    // ボタンをクリックしてバリデーションが通ったらプロフィール画像を編集する
    const clickUploadPicture = () => {
      uploadPicture(state)
      watch(processing, () => {
        if (!processing.value) {
          handleOpenModal('noModal')
        }
      })
    }

    // キャンセルしてモーダルを閉じる
    const clickCancel = () => {
      errorMessagePicture.value = ''
      processing.value = false
      initVariables()
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      modalType,
      handleOpenModal,
      hasPicture,
      errorMessagePicture,
      onFileTypeMismatch,
      onFileSizeExceed,
      handleNewImage,
      clickUploadPicture,
      clickCancel,
    }
  },
})
</script>

<style lang="scss" scoped>
.pictureEditModal {
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
  &__error {
    height: 14px;
    margin-bottom: 16px;
    color: $font-color-red;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
  }
  &__uploadButton {
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
  }
  &__cancelLinkWrap {
    margin: 0 auto 16px;
    text-align: center;
  }
  &__cancelLink {
    text-decoration: underline;
    display: inline-block;
    cursor: pointer;
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
  &__operationMethod {
    padding: 8px 8px 0;
    border: $border-color-lightgray solid 1px;
    background: $background-color-darkgray-opacity;
  }
  &__operationMethodTitle {
    margin-bottom: 8px;
    font-weight: bold;
  }
  &__operationMethodContent {
    margin-bottom: 8px;
    font-size: 1.2rem;
    line-height: 1.4;
  }
}
.pc {
  .pictureEditModal {
    width: 400px;
    &__uploadButton {
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
  .pictureEditModal {
    width: 100%;
    &__uploadButton {
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
