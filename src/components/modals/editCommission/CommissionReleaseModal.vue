<template>
  <transition name="fade">
    <Modal v-if="modalType === 'commissionRelease'">
      <div class="commissionReleaseModal">
        <p class="commissionReleaseModal__title">{{ pageTitle }}</p>
        <div class="commissionReleaseModal__commissionTitleWrap">
          <p class="commissionReleaseModal__commissionTitle">{{ commissionTitle }}</p>
        </div>
        <p class="commissionReleaseModal__caption">
          {{ $t('commissionRelease.captionFront')
          }}{{ release ? $t('commissionRelease.notRelease') : $t('commissionRelease.release')
          }}{{ $t('commissionRelease.captionBack') }}
        </p>
        <div class="commissionReleaseModal__inputButtonArea">
          <button class="commissionReleaseModal__inputButton" @click="clickChangeCommissionRelease">
            {{
              release
                ? $t('commissionRelease.changeNotRelease')
                : $t('commissionRelease.changeRelease')
            }}
          </button>
        </div>
        <div class="commissionReleaseModal__inputButtonArea">
          <p class="commissionReleaseModal__cancelLink" @click="handleOpenModal('noModal')">
            {{ $t('commissionRelease.cancel') }}
          </p>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, inject, useContext, watch } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { CommissionReleaseKey } from '@/compositions/key/commissionReleaseKey'
import { CommissionReleaseStore } from '@/compositions/commissionRelease'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  components: {
    Modal,
  },
  props: {
    currentCommissionId: {
      type: Number,
      required: true,
    },
    currentCommissionTitle: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    /** composition-api **/
    const { app } = useContext()
    /** /composition-api **/

    /** Inject **/
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const { commissionTitle, release, getCommissionRelease, changeCommissionRelease } = inject(
      CommissionReleaseKey
    ) as CommissionReleaseStore
    /** /Inject **/

    /** Computed **/
    const pageTitle = computed(() => {
      if (!release.value) {
        return app.i18n.t('commissionRelease.titleRelease').toString()
      }
      return app.i18n.t('commissionRelease.titleNotRelease').toString()
    })
    /** /Computed **/

    /** Watch **/
    // propsの変更を検知してworkUid、workTitle、releaseを取得する
    watch(props, () => {
      getCommissionRelease(props.currentCommissionId, props.currentCommissionTitle)
    })
    /** /Watch **/

    /** Function **/
    // ボタンをクリックして公開・非公開を切り替える
    const clickChangeCommissionRelease = () => {
      changeCommissionRelease(ctx)
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      modalType,
      handleOpenModal,
      commissionTitle,
      release,
      pageTitle,
      clickChangeCommissionRelease,
    }
  },
})
</script>

<style lang="scss" scoped>
.commissionReleaseModal {
  position: relative;
  &__title {
    margin-bottom: 16px;
    color: $font-color-white;
    line-height: 1.8;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__commissionTitleWrap {
    margin-top: 16px;
    padding: 8px;
    border-radius: 4px;
    border: $border-color-lightgray solid 1px;
    background: $background-color-lightgray-opacity;
  }
  &__commissionTitle {
    font-size: 1.6rem;
    color: $font-color-black;
    font-weight: bold;
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
.pc {
  .commissionReleaseModal {
    width: 600px;
  }
}
.sp {
  .commissionReleaseModal {
    width: 100%;
  }
}
</style>
