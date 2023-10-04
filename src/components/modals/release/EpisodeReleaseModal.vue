<template>
  <transition name="fade">
    <Modal v-if="modalType === 'episodeRelease'">
      <div class="episodeReleaseModal">
        <p class="episodeReleaseModal__title">{{ pageTitle }}</p>
        <p class="episodeReleaseModal__caption">
          この話を{{
            release ? '非公開' : '公開'
          }}にします。よろしければ下のボタンを押してください。
        </p>
        <div class="episodeReleaseModal__inputButtonArea">
          <button class="episodeReleaseModal__inputButton" @click="clickEpisodeRelease">
            {{ release ? '非公開にする' : '公開する' }}
          </button>
        </div>
        <div class="episodeReleaseModal__inputButtonArea">
          <p class="episodeReleaseModal__cancelLink" @click="handleOpenModal('noModal')">
            キャンセル
          </p>
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
    workUid: {
      type: String,
      required: true,
    },
    currentEpisodeId: {
      type: Number,
      required: true,
    },
  },
  setup(props, ctx) {
    /** Inject **/
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const { episodeNum, episodeTitle, release, getEpisodeRelease, changeEpisodeRelease } = inject(
      ReleaseKey
    ) as ReleaseStore
    /** /Inject **/

    /** Computed **/
    const pageTitle = computed(() => {
      if (!release.value) {
        return `${episodeNum.value} ${episodeTitle.value} を公開する`
      }
      return `${episodeNum.value} ${episodeTitle.value} を非公開にする`
    })
    /** /Computed **/

    /** Watch **/
    watch(props, () => {
      // propsの変更を検知してepisodeNum、episodeTitle、releaseを取得する
      getEpisodeRelease(props.workUid, props.currentEpisodeId)
    })
    /** /Watch **/

    /** Function **/
    // クリックして公開・非公開を確定する
    const clickEpisodeRelease = () => {
      changeEpisodeRelease(ctx, props.workUid, props.currentEpisodeId)
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      modalType,
      handleOpenModal,
      pageTitle,
      release,
      clickEpisodeRelease,
    }
  },
})
</script>

<style lang="scss" scoped>
.episodeReleaseModal {
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
