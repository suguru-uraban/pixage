<template>
  <transition name="fade">
    <Modal v-if="modalType === 'workRelease'">
      <div class="workReleaseModal">
        <p class="workReleaseModal__title">{{ pageTitle }}</p>
        <p class="workReleaseModal__caption">
          この作品を{{
            release ? '非公開' : '公開'
          }}します。よろしければ下のボタンを押してください。
        </p>
        <div class="workReleaseModal__inputButtonArea">
          <button class="workReleaseModal__inputButton" @click="clickChangeWorkRelease">
            {{ release ? '非公開にする' : '公開する' }}
          </button>
        </div>
        <div class="workReleaseModal__inputButtonArea">
          <p class="workReleaseModal__cancelLink" @click="handleOpenModal('noModal')">キャンセル</p>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, inject, watch } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { ReleaseKey } from '@/compositions/key/releaseKey'
import { ReleaseStore } from '@/compositions/release'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  components: {
    Modal,
  },
  props: {
    currentWorkId: {
      type: Number,
      required: true,
    },
    currentWorkTitle: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    /** Inject **/
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const { workTitle, release, getWorkRelease, changeWorkRelease } = inject(
      ReleaseKey
    ) as ReleaseStore
    /** /Inject **/

    /** Computed **/
    const pageTitle = computed(() => {
      if (!release.value) {
        return `${workTitle.value} を公開する`
      }
      return `${workTitle.value} を非公開にする`
    })
    /** /Computed **/

    /** Watch **/
    // propsの変更を検知してworkUid、workTitle、releaseを取得する
    watch(props, () => {
      getWorkRelease(props.currentWorkId, props.currentWorkTitle)
    })
    /** /Watch **/

    /** Function **/
    // ボタンをクリックして公開・非公開を切り替える
    const clickChangeWorkRelease = () => {
      changeWorkRelease(ctx)
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      modalType,
      handleOpenModal,
      release,
      pageTitle,
      clickChangeWorkRelease,
    }
  },
})
</script>

<style lang="scss" scoped>
.workReleaseModal {
  width: 600px;
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
    padding: 0 16px;
    height: 40px;
    color: $font-color-darkgray;
    line-height: 38px;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:hover {
      opacity: 0.6;
    }
  }
  &__cancelLink {
    color: $font-color-white;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      text-decoration: none;
    }
  }
}
</style>
