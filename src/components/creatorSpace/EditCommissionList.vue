<template>
  <div>
    <div class="postCommission">
      <p v-if="!myCommissions.length" class="postCommission__nothingCaption">
        {{ $t('editCommissionList.nothingListCaption') }}
      </p>
      <div v-if="!!myCommissions.length">
        <p class="postCommission__caption">{{ $t('editCommissionList.caption') }}</p>
        <ul class="postCommission__list">
          <li
            v-for="myCommission in myCommissions"
            :key="myCommission.commissionId"
            class="postCommission__listParts"
          >
            <p class="postCommission__title">{{ myCommission.commissionTitle }}</p>
            <div class="postCommission__buttonArea">
              <button
                class="postCommission__button"
                @click="openModalEdit(myCommission.commissionId)"
              >
                <font-awesome-icon :icon="['fas', 'edit']" />{{ $t('editCommissionList.edit') }}
              </button>
            </div>
            <div class="postCommission__buttonArea">
              <button
                class="postCommission__button"
                :disabled="!myCommission.approval"
                @click="
                  openModalWithCommissionId(myCommission.commissionId, myCommission.commissionTitle)
                "
              >
                <font-awesome-icon
                  v-if="myCommission.approval"
                  :icon="['fas', !myCommission.release ? 'lock-open' : 'lock']"
                />{{
                  myCommission.approval
                    ? !myCommission.release
                      ? $t('editCommissionList.release')
                      : $t('editCommissionList.notRelease')
                    : $t('editCommissionList.notApproval')
                }}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <CommissionReleaseModal
      :current-commission-id="currentCommissionId"
      :current-commission-title="currentCommissionTitle"
      @switch-release="switchRelease"
    />
    <EditCommissionModal />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { injectGlobalState } from '@/utils/states/user'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { EditCommissionKey } from '@/compositions/key/editCommissionKey'
import { EditCommissionStore } from '@/compositions/editCommission'
import { EditCommissionListKey } from '@/compositions/key/editCommissionListKey'
import { EditCommissionListStore } from '@/compositions/editCommissionList'
import CommissionReleaseModal from '@/components/modals/editCommission/CommissionReleaseModal.vue'
import EditCommissionModal from '@/components/modals/editCommission/EditCommissionModal.vue'

export default defineComponent({
  components: {
    CommissionReleaseModal,
    EditCommissionModal,
  },
  setup() {
    /** Inject **/
    const state = injectGlobalState()
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    const { initEditCommission } = inject(EditCommissionKey) as EditCommissionStore
    const { myCommissions, currentCommissionId, currentCommissionTitle, initEditCommissionList } =
      inject(EditCommissionListKey) as EditCommissionListStore
    /** /Inject **/

    /** Created **/
    // コミッション作成を初期化する関数を呼び出し
    initEditCommissionList(state.creatorId.value)
    /** /Created **/

    /** Function **/
    // 公開・非公開のモーダル表示
    const openModalWithCommissionId = (commissionId: number, commissionTitle: string) => {
      currentCommissionId.value = commissionId
      currentCommissionTitle.value = commissionTitle
      handleOpenModal('commissionRelease')
    }

    // 編集のモーダル表示
    const openModalEdit = (commissionId: number) => {
      initEditCommission(commissionId)
      handleOpenModal('editCommission')
    }

    // 公開・非公開の切り替え
    const switchRelease = () => {
      initEditCommissionList(state.creatorId.value)
    }
    /** /Function **/

    return {
      handleOpenModal,
      myCommissions,
      currentCommissionId,
      currentCommissionTitle,
      openModalWithCommissionId,
      openModalEdit,
      switchRelease,
    }
  },
})
</script>

<style lang="scss" scoped>
.postCommission {
  margin-bottom: 16px;
  padding: 16px 8px;
  width: 100%;
  position: relative;
  border-radius: 4px;
  border: $border-color-lightgray solid 1px;
  &__caption {
    margin-bottom: 16px;
  }
  &__list {
    width: 100%;
    border-top: $border-color-lightgray solid 1px;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__listParts {
    padding: 8px;
    width: 100%;
    align-items: center;
    border-bottom: $border-color-lightgray dotted 1px;
    &:nth-last-of-type(1) {
      border: none;
    }
  }
  &__title {
    font-weight: bold;
  }
  &__button {
    width: 100%;
    font-size: 1.2rem;
    color: $font-color-darkgray;
    text-align: center;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    > svg {
      margin-right: 4px;
    }
    &:disabled {
      opacity: 0.6;
    }
  }
}
.pc {
  .postCommission {
    &__title {
      line-height: 20px;
      flex: 1;
    }
    &__listParts {
      height: 56px;
      display: flex;
    }
    &__buttonArea {
      margin-left: 8px;
      width: 108px;
    }
    &__button {
      height: 40px;
      line-height: 38px;
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
.sp {
  .postCommission {
    &__nothingCaption,
    &__caption {
      font-size: 1.2rem;
    }
    &__title {
      margin-bottom: 8px;
      font-size: 1.2rem;
      line-height: 1.4;
    }
    &__buttonArea {
      margin: 0 4px;
      width: calc(50% - 12px);
      display: inline-block;
    }
    &__button {
      height: 32px;
      line-height: 30px;
      &:active {
        opacity: 0.6;
      }
    }
  }
}
</style>
