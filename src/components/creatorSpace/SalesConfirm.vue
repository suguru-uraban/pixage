<template>
  <div>
    <div class="salesConfirm">
      <ul v-if="!!salesConfirmWorks.length" class="salesConfirm__list">
        <li
          v-for="salesConfirmWork in salesConfirmWorks"
          :key="salesConfirmWork.workId"
          class="salesConfirm__listParts"
        >
          <div class="salesConfirm__listPartsTitle">{{ salesConfirmWork.workTitle }}</div>
          <div class="salesConfirm__listPartsPrice">
            <span>{{ $t('salesConfirm.total') }}</span
            >¥{{ Number(salesConfirmWork.totalPrice).toLocaleString() }}
          </div>
          <button
            class="salesConfirm__listPartsButton"
            @click="clickSalesConfirmDetail(salesConfirmWork.workId, salesConfirmWork.workTitle)"
          >
            {{ $t('salesConfirm.button') }}
          </button>
        </li>
      </ul>
      <p v-if="!salesConfirmWorks.length" class="salesConfirm__empty">
        {{ $t('salesConfirm.caption3') }}
      </p>
    </div>
    <SalesConfirmDetailModal :work-id="workId" :work-title="workTitle" />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { SalesConfirmWorkKey } from '@/compositions/key/salesConfirmWorkKey'
import { SalesConfirmWorkStore } from '@/compositions/salesConfirmWork'
import SalesConfirmDetailModal from '@/components/modals/salesConfirm/SalesConfirmDetailModal.vue'
import { injectGlobalState } from '@/utils/states/user'

export default defineComponent({
  components: {
    SalesConfirmDetailModal,
  },
  setup() {
    /** Variables **/
    const workId = ref<number>(0)
    const workTitle = ref<string>('')
    /** /Variables **/

    /** Inject **/
    const state = injectGlobalState()
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const { salesConfirmWorks, initSalesConfirmWorksList, initSalesConfirmWorkDetail } = inject(
      SalesConfirmWorkKey
    ) as SalesConfirmWorkStore
    /** /Inject **/

    /** Created **/
    // 課金される作品のリストを初期化する関数を呼び出し
    initSalesConfirmWorksList(state.creatorId.value)
    /** /Created **/

    /** Function **/
    // クリック時にworkIdとworkTitleを渡してモーダルを開く
    const clickSalesConfirmDetail = (id: number, title: string) => {
      workId.value = id
      workTitle.value = title
      initSalesConfirmWorkDetail(id)
      handleOpenModal('salesConfirmDetail')
    }
    /** /Function **/

    return {
      workId,
      workTitle,
      modalType,
      handleOpenModal,
      salesConfirmWorks,
      clickSalesConfirmDetail,
    }
  },
})
</script>

<style lang="scss" scoped>
.salesConfirm {
  padding: 8px;
  width: 100%;
  &__list {
    border-top: $border-color-lightgray solid 1px;
    border-left: $border-color-lightgray solid 1px;
    border-right: $border-color-lightgray solid 1px;
  }
  &__listParts {
    width: 100%;
    position: relative;
    border-bottom: $border-color-lightgray dotted 1px;
    &:nth-last-of-type(1) {
      border-bottom: $border-color-lightgray solid 1px;
    }
  }
  &__listPartsButton {
    height: 40px;
    color: $font-color-black;
    font-weight: normal;
    text-align: center;
    border-radius: 4px;
    border: $button-color-normal-border;
    background: $button-color-normal-bg;
  }
  &__empty {
    line-height: 1.6;
  }
}
.pc {
  .salesConfirm {
    &__list {
      margin: 16px;
    }
    &__listParts {
      padding: 0 16px;
      height: 64px;
      display: flex;
      align-items: center;
    }
    &__listPartsTitle {
      width: 350px;
    }
    &__listPartsPrice {
      margin: 0 8px;
      text-align: right;
      flex: 1;
      span {
        margin-right: 4px;
        font-size: 1.2px;
        display: inline-block;
      }
    }
    &__listPartsButton {
      width: 96px;
    }
    &__empty {
      margin: 16px;
    }
  }
}
.sp {
  .salesConfirm {
    &__list {
      margin: 8px 0;
    }
    &__listParts {
      padding: 16px 8px;
    }
    &__listPartsTitle {
      width: 168px;
    }
    &__listPartsPrice {
      margin-top: 8px;
      span {
        margin-right: 4px;
        font-size: 1.2px;
        display: inline-block;
      }
    }
    &__listPartsButton {
      width: 88px;
      margin: auto;
      position: absolute;
      top: 0;
      right: 8px;
      bottom: 0;
    }
    &__empty {
      margin: 8px 0;
    }
  }
}
</style>
