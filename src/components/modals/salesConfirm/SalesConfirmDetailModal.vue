<template>
  <transition name="fade">
    <Modal v-if="modalType === 'salesConfirmDetail'">
      <div class="salesConfirmDetailModal">
        <Loading v-if="processing" page-type="modal" />
        <div v-if="!processing">
          <p class="salesConfirmDetailModal__title">
            {{
              `${workTitle}${isOfficial ? $t('salesConfirmDetail.official') : ''} ${$t(
                'salesConfirmDetail.title'
              )}`
            }}
          </p>
          <dl class="salesConfirmDetailModal__totalSaleWrap">
            <dt class="salesConfirmDetailModal__totalSaleTitle">
              {{ $t('salesConfirmDetail.totalSaleTitle') }}
            </dt>
            <dd class="salesConfirmDetailModal__totalSalePrice">
              {{ `¥${workTotalPrice.toLocaleString()}` }}
            </dd>
          </dl>
          <div class="salesConfirmDetailModal__billable">
            <dl class="salesConfirmDetailModal__billableWrap">
              <dt class="salesConfirmDetailModal__billableTitle">
                {{ `${$t('salesConfirmDetail.billableTitle1')}` }}<br />{{
                  `${$t('salesConfirmDetail.billableTitle2')}${lastMonth}${$t(
                    'salesConfirmDetail.billableTitle3'
                  )}`
                }}
              </dt>
              <dd
                v-if="!isMultipleAuthors && !isOfficial"
                class="salesConfirmDetailModal__billablePrice"
              >
                {{ `¥${getAmountMinusFees(workBillablePrice).toLocaleString()}` }}
              </dd>
              <dd
                v-if="isMultipleAuthors && !isOfficial"
                class="salesConfirmDetailModal__billablePrice"
              >
                {{ `¥${getMultiAmountMinusFees(workBillablePrice).toLocaleString()}` }}
              </dd>
              <dd
                v-if="!isMultipleAuthors && isOfficial"
                class="salesConfirmDetailModal__billablePrice"
              >
                {{ `¥${getAmountMinusOfficialFees(workBillablePrice).toLocaleString()}` }}
              </dd>
              <dd
                v-if="isMultipleAuthors && isOfficial"
                class="salesConfirmDetailModal__billablePrice"
              >
                {{ `¥${getMultiAmountMinusOfficialFees(workBillablePrice).toLocaleString()}` }}
              </dd>
            </dl>
            <dl class="salesConfirmDetailModal__otherWrap">
              <dt class="salesConfirmDetailModal__otherTitle">
                {{ `${currentMonth}${$t('salesConfirmDetail.monthSaleTitle1')}` }}<br /><span>{{
                  $t('salesConfirmDetail.monthSaleTitle2')
                }}</span>
              </dt>
              <dd class="salesConfirmDetailModal__otherPrice">
                {{ `¥${workCurrentMonthBill.toLocaleString()}` }}
              </dd>
            </dl>
            <dl class="salesConfirmDetailModal__otherWrap">
              <dt class="salesConfirmDetailModal__otherTitle">
                {{ $t('salesConfirmDetail.unsettledTitle') }}
              </dt>
              <dd class="salesConfirmDetailModal__otherPrice">
                {{ `¥${workUnsettled.toLocaleString()}` }}
              </dd>
            </dl>
            <ul class="salesConfirmDetailModal__attention">
              <li class="salesConfirmDetailModal__attentionParts">
                {{ $t('salesConfirmDetail.attention1') }}
              </li>
              <li
                v-if="!isMultipleAuthors && !isOfficial"
                class="salesConfirmDetailModal__attentionParts"
              >
                {{ $t('salesConfirmDetail.attention2_1') }}
              </li>
              <li
                v-if="isMultipleAuthors && !isOfficial"
                class="salesConfirmDetailModal__attentionParts"
              >
                {{ $t('salesConfirmDetail.attention2_2') }}
              </li>
              <li
                v-if="isMultipleAuthors && !isOfficial"
                class="salesConfirmDetailModal__attentionParts"
              >
                {{ $t('salesConfirmDetail.attention2_3') }}
              </li>
              <li v-if="isOfficial" class="salesConfirmDetailModal__attentionParts">
                {{ $t('salesConfirmDetail.attention2_4') }}
              </li>
              <li
                v-if="isMultipleAuthors && isOfficial"
                class="salesConfirmDetailModal__attentionParts"
              >
                {{ $t('salesConfirmDetail.attention2_5') }}
              </li>
              <li
                v-if="!isMultipleAuthors && isOfficial"
                class="salesConfirmDetailModal__attentionParts"
              >
                {{ $t('salesConfirmDetail.attention2_6') }}
              </li>
              <li
                v-if="isMultipleAuthors && isOfficial"
                class="salesConfirmDetailModal__attentionParts"
              >
                {{ $t('salesConfirmDetail.attention2_7') }}
              </li>
              <li class="salesConfirmDetailModal__attentionParts">
                {{ $t('salesConfirmDetail.attention3_1')
                }}{{
                  `${
                    isMultipleAuthors
                      ? (minimumPayment * 2).toLocaleString()
                      : minimumPayment.toLocaleString()
                  }円`
                }}{{ $t('salesConfirmDetail.attention3_2') }}
              </li>
              <li class="salesConfirmDetailModal__attentionParts">
                {{ $t('salesConfirmDetail.attention4') }}
              </li>
              <li class="salesConfirmDetailModal__attentionParts important">
                {{ $t('salesConfirmDetail.attention5') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { SalesConfirmWorkKey } from '@/compositions/key/salesConfirmWorkKey'
import { SalesConfirmWorkStore } from '@/compositions/salesConfirmWork'
import Loading from '@/components/Loading.vue'
import Modal from '@/components/Modal.vue'
import { minimumPayment } from '@/constants/price'
import {
  getAmountMinusFees,
  getMultiAmountMinusFees,
  getAmountMinusOfficialFees,
  getMultiAmountMinusOfficialFees,
} from '@/utils/util'

export default defineComponent({
  components: {
    Loading,
    Modal,
  },
  props: {
    workId: {
      type: Number,
      required: true,
    },
    workTitle: {
      type: String,
      required: true,
    },
  },
  setup() {
    /** Variables **/
    const date = new Date()
    const currentMonth = date.getMonth() + 1
    const lastMonth =
      new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()).getMonth() + 1
    /** /Variables **/

    /** Inject **/
    const { modalType, handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      processing,
      isMultipleAuthors,
      isOfficial,
      workTotalPrice,
      workBillablePrice,
      workCurrentMonthBill,
      workUnsettled,
      episodePrices,
    } = inject(SalesConfirmWorkKey) as SalesConfirmWorkStore
    /** /Inject **/

    /** Function **/
    const clickCommitCreatorTypeAndIsActive = () => {
      handleOpenModal('noModal')
    }
    /** /Function **/

    return {
      currentMonth,
      lastMonth,
      minimumPayment,
      getAmountMinusFees,
      getMultiAmountMinusFees,
      getAmountMinusOfficialFees,
      getMultiAmountMinusOfficialFees,
      modalType,
      handleOpenModal,
      processing,
      isMultipleAuthors,
      isOfficial,
      workTotalPrice,
      workBillablePrice,
      workCurrentMonthBill,
      workUnsettled,
      episodePrices,
      clickCommitCreatorTypeAndIsActive,
    }
  },
})
</script>

<style lang="scss" scoped>
.salesConfirmDetailModal {
  position: relative;
  &__title {
    margin-bottom: 16px;
    color: $font-color-white;
    line-height: 1.8;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__totalSaleWrap {
    padding: 4px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: $border-color-white solid 1px;
  }
  &__totalSaleTitle {
    font-size: 2rem;
    font-weight: bold;
  }
  &__totalSalePrice {
    font-size: 2rem;
    font-weight: bold;
    text-align: right;
    flex: 1;
  }
  &__billable {
    margin-top: 16px;
    padding: 16px;
    border-radius: 4px;
    background: $background-color-lightgray-opacity;
  }
  &__billableWrap {
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: $border-color-gray solid 1px;
  }
  &__billableTitle {
    font-weight: bold;
    color: $font-color-darkgray;
  }
  &__billablePrice {
    font-weight: bold;
    color: $font-color-darkgray;
    text-align: right;
    flex: 1;
  }
  &__otherWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__otherTitle {
    font-weight: bold;
    color: $font-color-darkgray;
  }
  &__otherPrice {
    font-weight: bold;
    color: $font-color-darkgray;
    text-align: right;
    flex: 1;
  }
  &__attention {
    margin: 16px 16px 0;
  }
  &__attentionParts {
    padding-left: 1.2rem;
    font-size: 1.2rem;
    color: $font-color-darkgray;
    line-height: 1.6;
    text-indent: -1.1rem;
    &:before {
      content: '※';
    }
    &.important {
      color: $font-color-carmine;
      font-weight: bold;
    }
  }
}
.pc {
  .salesConfirmDetailModal {
    width: 800px;
    max-height: 500px;
    min-height: 420px;
    &__totalSaleTitle {
      font-size: 2rem;
    }
    &__totalSalePrice {
      font-size: 2rem;
    }
    &__billable {
      margin-top: 16px;
      padding: 16px;
    }
    &__billableTitle {
      font-size: 1.6rem;
    }
    &__billablePrice {
      font-size: 1.6rem;
    }
    &__otherWrap {
      margin: 0 0 0 8px;
      padding: 8px;
    }
    &__otherTitle {
      font-size: 1.4rem;
      span {
        font-size: 1.2rem;
      }
    }
    &__otherPrice {
      font-size: 1.4rem;
    }
  }
}
.sp {
  .salesConfirmDetailModal {
    width: 100%;
    &__totalSaleTitle {
      font-size: 1.4rem;
    }
    &__totalSalePrice {
      font-size: 1.4rem;
    }
    &__billable {
      margin-top: 8px;
      padding: 8px;
    }
    &__otherWrap {
      margin: 0;
      padding: 8px;
    }
    &__otherTitle {
      font-size: 1.2rem;
      span {
        font-size: 1rem;
      }
    }
    &__otherPrice {
      font-size: 1.2rem;
    }
  }
}
</style>
