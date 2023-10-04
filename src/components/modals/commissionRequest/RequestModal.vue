<template>
  <transition name="fade">
    <Modal v-if="modalType === 'commissionRequest'">
      <div class="requestModal">
        <p class="requestModal__title">{{ $t('commissionRequest.title') }}</p>
        <p class="requestModal__caption">{{ $t('commissionRequest.caption1') }}</p>
        <p class="requestModal__caption">{{ $t('commissionRequest.caption2') }}</p>
        <div class="requestModal__block">
          <dl class="requestModal__infoBlock">
            <dt class="requestModal__infoTitle">{{ $t('commissionRequest.subTitle1') }}</dt>
            <dd class="requestModal__infoContent">{{ title }}</dd>
          </dl>
          <dl class="requestModal__infoBlock">
            <dt class="requestModal__infoTitle">{{ $t('commissionRequest.subTitle2') }}</dt>
            <dd class="requestModal__infoContent">
              {{ type === 'comic' ? $t('commissionRequest.typeComic') : '' }}
              {{ type === 'illust' ? $t('commissionRequest.typeIllust') : '' }}
              {{ type === 'cosplay' ? $t('commissionRequest.typeCosplay') : '' }}
              {{ type === 'anime' ? $t('commissionRequest.typeAnime') : '' }}
            </dd>
          </dl>
          <dl class="requestModal__infoBlock">
            <dt class="requestModal__infoTitle">{{ $t('commissionRequest.subTitle3') }}</dt>
            <dd class="requestModal__infoContent">{{ price }}</dd>
          </dl>
        </div>
        <div class="requestModal__sendButtonArea">
          <button
            class="requestModal__sendButton"
            :disabled="processing"
            @click="clickSendEditCommission"
          >
            {{ $t('postCommission.send') }}
          </button>
        </div>
        <div class="requestModal__cancelLinkArea">
          <p class="requestModal__cancelLink" @click="handleOpenModal('noModal')">
            {{ $t('commissionRelease.cancel') }}
          </p>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, watch } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { EditCommissionListKey } from '@/compositions/key/editCommissionListKey'
import { EditCommissionListStore } from '@/compositions/editCommissionList'
import { EditCommissionKey } from '@/compositions/key/editCommissionKey'
import { EditCommissionStore } from '@/compositions/editCommission'
import Modal from '@/components/Modal.vue'
import { injectGlobalState } from '@/utils/states/user'

export default defineComponent({
  components: {
    Modal,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  setup() {
    /** Inject **/
    const state = injectGlobalState()
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const { initEditCommissionList } = inject(EditCommissionListKey) as EditCommissionListStore
    const {
      isDevelop,
      isOpen,
      processing,
      commissionTitle,
      commissionType,
      commissionPrice,
      commissionDescription,
      workPeriod,
      acceptDetail,
      imageFilesErrorMessage,
      myVueUploadDropImagesRef,
      currentImages,
      isDirty,
      params,
      addFile,
      handleImageValidate,
      handleImageNull,
      deleteImage,
      clickSendEditCommission,
      handleImage,
    } = inject(EditCommissionKey) as EditCommissionStore
    /** /Inject **/

    /** LifeCycle **/
    onMounted(() => {
      isDevelop.value = !!window.location.href.match(/development|localhost/)
    })
    /** /LifeCycle **/

    /** Watch **/
    // isOpenを監視して、falseになったらモーダルを閉じる
    watch(isOpen, () => {
      if (!isOpen.value) {
        initEditCommissionList(state.creatorId.value)
        handleOpenModal('noModal')
      }
    })
    /** /Watch **/

    return {
      modalType,
      handleOpenModal,
      processing,
      commissionTitle,
      commissionType,
      commissionPrice,
      commissionDescription,
      workPeriod,
      acceptDetail,
      imageFilesErrorMessage,
      myVueUploadDropImagesRef,
      currentImages,
      isDirty,
      params,
      addFile,
      handleImageValidate,
      handleImageNull,
      deleteImage,
      clickSendEditCommission,
      handleImage,
    }
  },
})
</script>

<style lang="scss" scoped>
.requestModal {
  position: relative;
  &__title {
    margin-bottom: 16px;
    line-height: 1.8;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__block {
    margin-bottom: 24px;
  }
  &__caption {
    margin: 8px 8px 0;
    font-size: 1.2rem;
    line-height: 1.4;
  }
  &__infoBlock {
    margin: 16px 0 0 8px;
  }
  &__infoTitle {
    margin-bottom: 4px;
  }
  &__infoContent {
    padding-left: 8px;
  }
  &__attentionList {
    margin: 8px 8px 0 8px;
    padding-left: 1.2rem;
  }
  &__attentionListParts {
    margin-bottom: 8px;
    padding-left: 1.2rem;
    font-size: 1.2rem;
    line-height: 1.4;
    display: flex;
    &:before {
      content: '※';
      text-indent: -2rem;
    }
  }
  &__infoInput {
    margin-top: 4px;
    padding: 0 8px 16px 0;
    position: relative;
    &.image {
      padding: 0 8px 0 0;
      color: $font-color-black;
    }
  }
  &__inputText {
    padding: 4px;
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
    &:disabled {
      border: $border-color-gray solid 1px;
      background: $border-color-lightgray;
    }
  }
  &__textarea {
    padding: 4px;
    width: 100%;
    height: 600px;
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
  &__select {
    margin-right: 8px;
    width: 168px;
    position: relative;
    &:after {
      margin: auto;
      width: 0;
      height: 0;
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 8px;
      bottom: 0;
      border-style: solid;
      border-width: 10px 8px 0 8px;
      border-color: $border-color-gray transparent transparent transparent;
      pointer-events: none;
    }
    select {
      padding: 8px 4px;
      width: 100%;
      font-size: 1.6rem;
      color: $font-color-darkgray;
      border-radius: 4px;
      border: $border-color-gray solid 1px;
      background: $background-color-white;
      &:disabled {
        border: $border-color-gray solid 1px;
        background: $border-color-lightgray;
      }
      &:hidden {
        opacity: 0.6;
      }
    }
    &.inValid {
      select {
        border: $border-color-red solid 1px;
        background: $background-color-pink;
      }
    }
  }
  &__check {
    padding: 8px 0;
    color: $font-color-white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    input[type='checkbox'] {
      display: none;
    }
    label {
      margin: 0 8px;
      width: 24px;
      height: 24px;
      line-height: 30px;
      text-align: center;
      display: block;
      position: relative;
      border-radius: 4px;
      border: $border-color-lightgray solid 2px;
      background: $background-color-white;
    }
    input[type='checkbox']:checked + label:after {
      width: 10px;
      height: 16px;
      content: '';
      display: block;
      position: absolute;
      left: 5px;
      border-right: $border-color-gray solid 3px;
      border-bottom: $border-color-gray solid 3px;
      transform: rotate(45deg);
    }
  }
  &__sendButtonArea {
    padding: 32px 0 16px;
  }
  &__sendButton {
    margin: 0 auto;
    height: 40px;
    color: $font-color-darkgray;
    text-align: center;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: 1px solid $button-color-metal-border;
    background: $button-color-metal-bg;
    box-shadow: inset 1px 1px 1px $glow-color;
    &:disabled {
      opacity: 0.6;
    }
  }
  &__isUpdate {
    margin: 0 auto;
    height: 40px;
    color: $font-color-green;
    text-align: center;
    line-height: 38px;
    display: block;
    border-radius: 8px;
    border: 1px solid $border-color-green;
    background: $background-color-opalGreen;
  }
  &__completed {
    width: 100%;
  }
  &__completedCaptionUpper {
    margin-bottom: 16px;
    font-size: 1.6rem;
    font-weight: bold;
    text-align: center;
  }
  &__completedCaptionLower {
    font-size: 1.4rem;
    line-height: 1.6;
  }
  &__error {
    height: 14px;
    margin: 8px 0 16px;
    color: $font-color-red;
    font-size: 1.2rem;
    font-weight: bold;
  }
  &__currentImages {
    margin: 16px 8px 16px 0;
    padding: 8px;
    border-radius: 4px;
    border: $border-color-lightgray solid 1px;
  }
  &__currentImagesTitle {
    margin-bottom: 8px;
  }
  &__currentImagesCaption {
    margin: 24px 0;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
  }
  &__currentImagesImage {
    margin: 0 4px;
    display: inline-block;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border: $border-color-darkgray solid 1px;
    }
  }
  &__currentImagesDelete {
    width: 40px;
    height: 40px;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0 0 0 4px;
    background: $background-color-darkgray-opacity;
    cursor: pointer;
  }
  &__cancelLinkArea {
    padding: 16px 0;
    text-align: center;
  }
  &__cancelLink {
    margin-top: 16px;
    color: $font-color-lightgray;
    display: inline-block;
    text-decoration: underline;
    cursor: pointer;
  }
}
.pc {
  .requestModal {
    width: 800px;
    &__inputText {
      &[data-style='title'] {
        width: 100%;
      }
      &[data-style='email'] {
        width: 400px;
      }
      &[data-style='workPeriod'] {
        width: 200px;
      }
    }
    &__sendButton {
      width: 200px;
      &:hover {
        opacity: 0.6;
      }
    }
    &__isUpdate {
      width: 200px;
    }
    &__currentImagesImage {
      width: 200px;
      height: 200px;
    }
    &__cancelLink {
      &:hover {
        text-decoration: none;
        opacity: 0.6;
      }
    }
  }
}
.sp {
  .requestModal {
    width: 100%;
    &__inputText {
      width: 100%;
    }
    &__sendButton {
      width: 100%;
      &:active {
        opacity: 0.6;
      }
    }
    &__isUpdate {
      width: 100%;
    }
    &__currentImagesImage {
      margin: 0 4px;
      width: calc(50% - 8px);
      padding-top: calc(50% - 8px);
      position: relative;
      img {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &__cancelLink {
      &:active {
        text-decoration: none;
        opacity: 0.6;
      }
    }
  }
}
</style>
