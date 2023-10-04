<template>
  <transition name="fade">
    <Modal v-if="modalType === 'editCommission'">
      <div class="editCommissionModal">
        <p class="editCommissionModal__title">{{ $t('postCommission.modalTitle') }}</p>
        <p class="editCommissionModal__caption">
          {{ $t('postCommission.caption3') }}
        </p>
        <div class="editCommissionModal__block">
          <dl class="editCommissionModal__infoBlock">
            <dt class="editCommissionModal__infoTitle">
              {{ $t('postCommission.subTitle1') }}<span>{{ $t('postCommission.required') }}</span>
            </dt>
            <dd>
              <ul class="editCommissionModal__attentionList">
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommission.attention1_1') }}
                </li>
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommission.attention1_2') }}
                </li>
              </ul>
            </dd>
            <dd class="editCommissionModal__infoInput">
              <input
                v-model="commissionTitle"
                value=""
                type="text"
                :placeholder="$t('postCommission.placeholder1')"
                :class="[
                  'editCommissionModal__inputText',
                  {
                    inValid: isDirty.commissionTitle && params.commissionTitle.$anyInvalid,
                  },
                ]"
                data-style="title"
              />
              <Error
                v-if="isDirty.commissionTitle && params.commissionTitle.required.$invalid"
                :message="params.commissionTitle.required.$message"
                type="input"
              />
              <Error
                v-if="isDirty.commissionTitle && params.commissionTitle.format.$invalid"
                :message="params.commissionTitle.format.$message"
                type="input"
              />
            </dd>
          </dl>
          <dl class="editCommissionModal__infoBlock">
            <dt class="editCommissionModal__infoTitle">
              {{ $t('postCommission.subTitle2') }}<span>{{ $t('postCommission.required') }}</span>
            </dt>
            <dd>
              <ul class="editCommissionModal__attentionList">
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommission.attention2_1') }}
                </li>
              </ul>
            </dd>
            <dd class="editCommissionModal__infoInput">
              <div class="editCommissionModal__inputBlock">
                <div
                  :class="[
                    'editCommissionModal__select',
                    {
                      inValid: isDirty.commissionType && params.commissionType.$anyInvalid,
                    },
                  ]"
                  data-style="collaborator"
                >
                  <select v-model="commissionType">
                    <option value="" selected hidden>
                      {{ $t('postCommission.placeholder2_1') }}
                    </option>
                    <option value="comic">{{ $t('postCommission.placeholder2_2') }}</option>
                    <option value="illust">{{ $t('postCommission.placeholder2_3') }}</option>
                    <option value="cosplay">{{ $t('postCommission.placeholder2_4') }}</option>
                    <option value="anime">{{ $t('postCommission.placeholder2_5') }}</option>
                  </select>
                </div>
              </div>
              <Error
                v-if="isDirty.commissionType && params.commissionType.required.$invalid"
                :message="params.commissionType.required.$message"
                type="input"
              />
            </dd>
          </dl>
          <dl class="editCommissionModal__infoBlock">
            <dt class="editCommissionModal__infoTitle">
              {{ $t('postCommission.subTitle3') }}<span>{{ $t('postCommission.required') }}</span>
            </dt>
            <dd>
              <ul class="editCommissionModal__attentionList">
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommission.attention3_1') }}
                </li>
              </ul>
            </dd>
            <dd class="editCommissionModal__infoInput">
              <input
                v-model="commissionPrice"
                value=""
                type="number"
                :placeholder="$t('postCommission.placeholder3')"
                :class="[
                  'editCommissionModal__inputText',
                  {
                    inValid: isDirty.commissionPrice && params.commissionPrice.$anyInvalid,
                  },
                ]"
                data-style="commissionPrice"
              />
              <Error
                v-if="isDirty.commissionPrice && params.commissionPrice.required.$invalid"
                :message="params.commissionPrice.required.$message"
                type="input"
              />
              <Error
                v-if="isDirty.commissionPrice && params.commissionPrice.format.$invalid"
                :message="params.commissionPrice.format.$message"
                type="input"
              />
            </dd>
          </dl>
          <dl class="editCommissionModal__infoBlock">
            <dt class="editCommissionModal__infoTitle">
              {{ $t('postCommission.subTitle4') }}<span>{{ $t('postCommission.required') }}</span>
            </dt>
            <dd>
              <ul class="editCommissionModal__attentionList">
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommission.attention4_1') }}
                </li>
              </ul>
            </dd>
            <dd class="editCommissionModal__infoInput">
              <textarea
                v-model="commissionDescription"
                value=""
                :class="[
                  'editCommissionModal__textarea',
                  {
                    inValid:
                      isDirty.commissionDescription && params.commissionDescription.$anyInvalid,
                  },
                ]"
              ></textarea>
              <TextCount :text="commissionDescription" :max="2000" layout="default" />
              <Error
                v-if="
                  isDirty.commissionDescription && params.commissionDescription.required.$invalid
                "
                :message="params.commissionDescription.required.$message"
                type="commissionDescription"
              />
              <Error
                v-if="isDirty.commissionDescription && params.commissionDescription.format.$invalid"
                :message="params.commissionDescription.format.$message"
                type="commissionDescription"
              />
            </dd>
          </dl>
          <dl class="editCommissionModal__infoBlock">
            <dt class="editCommissionModal__infoTitle">
              {{ $t('postCommission.subTitle6') }}<span>{{ $t('postCommission.required') }}</span>
            </dt>
            <dd>
              <ul class="editCommissionModal__attentionList">
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommission.attention6_1') }}
                </li>
              </ul>
            </dd>
            <dd class="editCommissionModal__infoInput">
              <input
                v-model="workPeriod"
                value=""
                type="number"
                :placeholder="$t('postCommission.placeholder6')"
                :class="[
                  'editCommissionModal__inputText',
                  { inValid: isDirty.workPeriod && params.workPeriod.$anyInvalid },
                ]"
                data-style="workPeriod"
              />
              <Error
                v-if="isDirty.workPeriod && params.workPeriod.required.$invalid"
                :message="params.workPeriod.required.$message"
                type="input"
              />
            </dd>
          </dl>
          <dl class="editCommissionModal__infoBlock">
            <dd class="editCommissionModal__infoInput">
              <div class="editCommissionModal__check">
                <input
                  id="acceptDetail"
                  v-model="acceptDetail"
                  type="checkbox"
                  name="acceptDetail"
                /><label for="acceptDetail" />{{ $t('postCommission.subTitle5') }}
              </div>
              <ul class="editCommissionModal__attentionList">
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommission.attention5_1') }}
                </li>
              </ul>
            </dd>
          </dl>
          <dl class="editCommissionModal__infoBlock">
            <dt class="editCommissionModal__infoTitle">
              {{ $t('postCommissionImages.title') }}
            </dt>
            <dd>
              <ul class="editCommissionModal__attentionList">
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommissionImages.attention1') }}
                </li>
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommissionImages.attention2') }}
                </li>
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommissionImages.attention3') }}
                </li>
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommissionImages.attention4') }}
                </li>
              </ul>
            </dd>
            <dd class="editCommissionModal__currentImages">
              <p class="editCommissionModal__currentImagesTitle">
                {{ $t('postCommissionImages.currentImagesTitle') }}
              </p>
              <ul class="editCommissionModal__attentionList">
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommissionImages.attention5') }}
                </li>
                <li class="editCommissionModal__attentionListParts">
                  {{ $t('postCommissionImages.attention6') }}
                </li>
              </ul>
              <div v-if="currentImages.length">
                <div
                  v-for="(image, index) in currentImages"
                  :key="image"
                  class="editCommissionModal__currentImagesImage"
                >
                  <img :src="image" alt="" />
                  <div class="editCommissionModal__currentImagesDelete" @click="deleteImage(index)">
                    <font-awesome-icon :icon="['fas', 'times']" />
                  </div>
                </div>
              </div>
              <p v-if="!currentImages.length" class="editCommissionModal__currentImagesCaption">
                {{ $t('postCommissionImages.currentImagesNothing') }}
              </p>
            </dd>
            <dd v-if="currentImages.length < 2" class="editCommissionModal__infoInput image">
              <UploadImages
                ref="myVueUploadDropImagesRef"
                :upload-msg="$t('postCommissionImages.uploadMsg')"
                :clear-all="$t('postCommissionImages.clearAll')"
                @changed="handleImage"
              />
              <div class="editCommissionModal__error">{{ imageFilesErrorMessage }}</div>
            </dd>
          </dl>
        </div>
        <div class="editCommissionModal__sendButtonArea">
          <button
            class="editCommissionModal__sendButton"
            :disabled="processing"
            @click="clickSendEditCommission"
          >
            {{ $t('postCommission.send') }}
          </button>
        </div>
        <div class="editCommissionModal__cancelLinkArea">
          <p class="editCommissionModal__cancelLink" @click="handleOpenModal('noModal')">
            {{ $t('postCommission.cancel') }}
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
import Error from '@/components/shared/Error.vue'
import TextCount from '@/components/shared/TextCount.vue'
import { injectGlobalState } from '@/utils/states/user'

export default defineComponent({
  components: {
    Modal,
    Error,
    TextCount,
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
.editCommissionModal {
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
    font-weight: normal;
    span {
      margin-left: 4px;
      font-size: 1.2rem;
      color: $font-color-red;
    }
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
  .editCommissionModal {
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
  .editCommissionModal {
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
