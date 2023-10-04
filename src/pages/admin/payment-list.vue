<template>
  <div>
    <Breadcrumb :breadcrumbs="adminPaymentList()" />
    <div class="adminPaymentList">
      <h1 class="adminPaymentList__title">クリエイターへの支払い一覧</h1>
      <div class="adminPaymentList__selectWrap">
        <div class="adminPaymentList__dateWrap">
          <div class="adminPaymentList__select year">
            <select v-model="year">
              <option value="" hidden>年を選択</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
          年
        </div>
        <div class="adminPaymentList__dateWrap">
          <div class="adminPaymentList__select month">
            <select v-model="month">
              <option value="" hidden>月を選択</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
          </div>
          月
        </div>
        <button class="adminPaymentList__button" @click="initPaymentList">表示</button>
      </div>
      <div v-if="!!paymentList.length">
        <ul class="adminPaymentList__header">
          <li class="adminPaymentList__headerTitle" data-style="displayName">表示名</li>
          <li class="adminPaymentList__headerTitle" data-style="price">支払い額</li>
          <li class="adminPaymentList__headerTitle" data-style="official">振込手数料</li>
          <li class="adminPaymentList__headerTitle" data-style="accountName">口座名義</li>
          <li class="adminPaymentList__headerTitle" data-style="financialInstitutionName">
            金融機関名
          </li>
          <li class="adminPaymentList__headerTitle" data-style="branchName">支店名</li>
          <li class="adminPaymentList__headerTitle" data-style="accountNumber">口座番号</li>
          <li class="adminPaymentList__headerTitle" data-style="phoneNumber">電話番号</li>
          <li class="adminPaymentList__headerTitle" data-style="check" />
        </ul>
        <ul class="adminPaymentList__list">
          <li
            v-for="payment in paymentList"
            :key="payment.uid"
            :class="['adminPaymentList__listBlock', { done: payment.done }]"
          >
            <div class="adminPaymentList__listDisplayName">{{ payment.displayName }}</div>
            <div class="adminPaymentList__listPrice">¥{{ payment.price.toLocaleString() }}</div>
            <div class="adminPaymentList__listOfficial">
              {{ payment.official ? '弊社負担' : '-' }}
            </div>
            <div class="adminPaymentList__listAccountName">{{ payment.accountName }}</div>
            <div class="adminPaymentList__listFinancialInstitutionName">
              {{ payment.financialInstitutionName }}
            </div>
            <div class="adminPaymentList__listBranchName">{{ payment.branchName }}</div>
            <div class="adminPaymentList__listAccountNumber">{{ payment.accountNumber }}</div>
            <div class="adminPaymentList__listPhoneNumber">{{ payment.phoneNumber }}</div>
            <div class="adminPaymentList__check">
              <input
                id="check"
                type="checkbox"
                name="payment_done"
                :checked="payment.done"
                :value="payment.done"
                :disabled="payment.done"
                @input="donePayment(payment.uid)"
              /><label for="check" />
              <p class="adminPaymentList__checkCaption">
                {{ payment.done ? '支払い済み' : '未払い' }}
              </p>
            </div>
          </li>
        </ul>
        <div
          v-if="!!noReceivableAccountList.length"
          class="adminPaymentList__noReceivableAccountWrap"
        >
          <p class="adminPaymentList__subTitle">口座番号を入力していないユーザー</p>
          <p class="adminPaymentList__attention">
            クリエイタースペースにアラートが出ていますが、こちらからも連絡を入れてください。<br />
            Twitterアカウントでログインしているためメールアドレスが不明のユーザーは、以下の方法で連絡してください。<br />
            ・ユーザーUIDをFirebase管理画面にアクセスできる管理者に伝えて、Twitterアカウントを調べてもらう<br />
            ・口座番号を入力していない可能性があるのは、作画と原作が別れている場合に限られるので、相方に連絡して連絡先を聞く
          </p>
          <ul class="adminPaymentList__header">
            <li class="adminPaymentList__headerTitle" data-style="displayName">表示名</li>
            <li class="adminPaymentList__headerTitle" data-style="price">支払い額</li>
            <li class="adminPaymentList__headerTitle" data-style="official">振込手数料</li>
            <li class="adminPaymentList__headerTitle" data-style="email">メールアドレス</li>
            <li class="adminPaymentList__headerTitle" data-style="uid">ユーザーUID</li>
          </ul>
          <ul class="adminPaymentList__list">
            <li
              v-for="list in noReceivableAccountList"
              :key="list.uid"
              :class="['adminPaymentList__listBlock', { done: list.done }]"
            >
              <div class="adminPaymentList__listDisplayName">{{ list.displayName }}</div>
              <div class="adminPaymentList__listPrice">¥{{ list.price.toLocaleString() }}</div>
              <div class="adminPaymentList__listOfficial">
                {{ list.official ? '弊社負担' : '-' }}
              </div>
              <div class="adminPaymentList__listEmail">
                {{ list.email !== '' ? list.email : '-' }}
              </div>
              <div class="adminPaymentList__listUid">{{ list.uid }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="!paymentList.length">
        <p class="adminPaymentList__caption">クリエイターへの支払いはありません。</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useMeta, inject } from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { PaymentListKey } from '@/compositions/key/paymentListKey'
import { PaymentListStore } from '@/compositions/paymentList'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'

export default defineComponent({
  components: {
    Breadcrumb,
  },
  layout: 'Admin',
  setup() {
    /** composition-api **/
    const { title, titleTemplate, meta } = useMeta()
    /** /composition-api **/

    /** Inject **/
    const { adminPaymentList } = inject(BreadcrumbKey) as BreadcrumbStore
    const { year, month, paymentList, noReceivableAccountList, initPaymentList, donePayment } =
      inject(PaymentListKey) as PaymentListStore
    /** /Inject **/

    /** Created **/
    // ユーザーの初期読み込み関数の呼び出し
    initPaymentList()
    /** /Created **/

    /** Meta **/
    title.value = 'クリエイターへの支払い一覧'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminPaymentList,
      year,
      month,
      paymentList,
      noReceivableAccountList,
      initPaymentList,
      donePayment,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.adminPaymentList {
  &__title {
    margin-bottom: 16px;
    font-size: 2rem;
    line-height: 2;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__subTitle {
    margin-bottom: 8px;
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__caption {
    margin: 0 0 8px 8px;
  }
  &__attention {
    font-size: 1.3rem;
    color: $font-color-lightgray;
    line-height: 1.4;
    margin: 0 0 16px 8px;
  }
  &__selectWrap {
    margin: 0 0 8px 8px;
    display: flex;
    align-items: center;
  }
  &__dateWrap {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }
  &__select {
    margin-right: 8px;
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
    }
    &.inValid {
      select {
        border: $border-color-red solid 1px;
        background: $background-color-pink;
      }
    }
    &[data-style='collaborator'] {
      width: 168px;
    }
    &[data-style='selectWork'] {
      width: 100%;
    }
    &.year {
      width: 80px;
    }
    &.month {
      width: 60px;
    }
  }
  &__button {
    padding: 0 16px;
    height: 36px;
    font-size: 1.3rem;
    color: $font-color-darkgray;
    line-height: 36px;
    text-align: center;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:hover {
      opacity: 0.6;
    }
  }
  &__header {
    margin: 0 12px;
    width: calc(100% - 24px);
    min-width: 800px;
    display: flex;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__headerTitle {
    padding: 8px 4px;
    font-size: 1.2rem;
    font-weight: bold;
    &[data-style='displayName'] {
      flex: 1;
    }
    &[data-style='price'] {
      width: 100px;
    }
    &[data-style='official'] {
      width: 70px;
    }
    &[data-style='accountName'] {
      width: 180px;
    }
    &[data-style='financialInstitutionName'] {
      width: 200px;
    }
    &[data-style='branchName'] {
      width: 180px;
    }
    &[data-style='accountNumber'] {
      width: 70px;
    }
    &[data-style='phoneNumber'] {
      width: 100px;
    }
    &[data-style='check'] {
      width: 130px;
    }
    &[data-style='email'] {
      width: 300px;
    }
    &[data-style='uid'] {
      width: 400px;
    }
  }
  &__list {
    margin: 0 12px;
    width: calc(100% - 24px);
    min-width: 800px;
  }
  &__listBlock {
    width: 100%;
    min-height: 33px;
    line-height: 1.4;
    display: flex;
    align-items: center;
    border-bottom: $border-color-lightgray dotted 1px;
    &.done {
      background: $background-color-lightgray-opacity;
    }
  }
  &__listPicture {
    padding: 8px 0;
    width: 70px;
    > img {
      width: 40px;
      height: 40px;
    }
  }
  &__listDisplayName {
    padding: 8px 4px;
    flex: 1;
  }
  &__listPrice {
    padding: 8px 4px;
    width: 100px;
  }
  &__listOfficial {
    padding: 8px 4px;
    width: 70px;
    text-align: center;
  }
  &__listAccountName {
    padding: 8px 4px;
    width: 180px;
    word-wrap: break-word;
  }
  &__listFinancialInstitutionName {
    padding: 8px 4px;
    width: 200px;
    font-size: 1.2rem;
    word-wrap: break-word;
  }
  &__listBranchName {
    padding: 8px 4px;
    width: 180px;
    font-size: 1.2rem;
  }
  &__listAccountNumber {
    padding: 8px 4px;
    width: 70px;
  }
  &__listPhoneNumber {
    padding: 8px 4px;
    width: 100px;
  }
  &__check {
    padding: 8px 4px;
    width: 130px;
    display: flex;
    align-items: center;
    position: relative;
    input[type='checkbox'] {
      display: none;
    }
    label {
      width: 24px;
      height: 24px;
      line-height: 30px;
      text-align: center;
      display: block;
      position: relative;
      border-radius: 4px;
      border: $border-color-lightgray solid 2px;
    }
    input[type='checkbox']:checked + label {
      cursor: not-allowed;
      &:after {
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
  }
  &__checkCaption {
    margin-left: 8px;
  }
  &__listEmail {
    padding: 8px 4px;
    width: 300px;
    font-size: 1.2rem;
  }
  &__listUid {
    padding: 8px 4px;
    width: 400px;
    font-size: 1.2rem;
  }
  &__noReceivableAccountWrap {
    margin-top: 32px;
    padding: 8px;
    border: $border-color-red solid 2px;
  }
}
</style>
