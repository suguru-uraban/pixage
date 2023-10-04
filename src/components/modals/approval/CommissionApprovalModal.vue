<template>
  <transition name="fade">
    <Modal v-if="modalType === 'commissionApproval'">
      <div class="commissionApprovalModal">
        <p class="commissionApprovalModal__title">{{ pageTitle }}</p>
        <div class="commissionApprovalModal__commissionTitleWrap">
          <p class="commissionApprovalModal__commissionTitle">{{ commissionTitle }}</p>
        </div>
        <p class="commissionApprovalModal__caption">
          上記のコミッションを{{
            approval ? '非承認' : '承認'
          }}します。よろしければ下のボタンを押してください。
        </p>
        <div class="commissionApprovalModal__inputButtonArea">
          <button
            class="commissionApprovalModal__inputButton"
            @click="clickChangeCommissionRelease"
          >
            {{ approval ? '非承認にする' : '承認する' }}
          </button>
        </div>
        <div class="commissionApprovalModal__inputButtonArea">
          <p class="commissionApprovalModal__cancelLink" @click="handleOpenModal('noModal')">
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
import { ApprovalKey } from '@/compositions/key/approvalKey'
import { ApprovalStore } from '@/compositions/approval'
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
    /** Inject **/
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const { commissionTitle, approval, getCommissionApproval, changeCommissionApproval } = inject(
      ApprovalKey
    ) as ApprovalStore
    /** /Inject **/

    /** Computed **/
    const pageTitle = computed(() => {
      if (!approval.value) {
        return 'このコミッションを承認する'
      }
      return 'このコミッションを非承認にする'
    })
    /** /Computed **/

    /** Watch **/
    // propsの変更を検知してworkUid、workTitle、releaseを取得する
    watch(props, () => {
      getCommissionApproval(props.currentCommissionId, props.currentCommissionTitle)
    })
    /** /Watch **/

    /** Function **/
    // ボタンをクリックして公開・非公開を切り替える
    const clickChangeCommissionRelease = () => {
      changeCommissionApproval(ctx)
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      modalType,
      handleOpenModal,
      commissionTitle,
      approval,
      pageTitle,
      clickChangeCommissionRelease,
    }
  },
})
</script>

<style lang="scss" scoped>
.commissionApprovalModal {
  width: 600px;
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
</style>
