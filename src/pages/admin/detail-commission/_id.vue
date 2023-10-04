<template>
  <div>
    <Breadcrumb :breadcrumbs="adminDetailCommission()" />
    <div class="detailCommission">
      <h1 class="detailCommission__title">コミッション詳細</h1>

      <div class="detailCommission__upper">
        <div class="detailCommission__imageWrap">
          <div class="detailCommission__image">
            <img
              :src="
                picture === ''
                  ? require('@/assets/images/icon_default_picture.svg')
                  : picture.replace('_normal', '')
              "
              :alt="displayName"
              @error="onError"
            />
          </div>
        </div>
        <div class="detailCommission__upperRight">
          <dl class="detailCommission__upperRightHeader">
            <dt class="detailCommission__upperRightBlockCommissionTitle">{{ commissionTitle }}</dt>
            <dd class="detailCommission__upperRightBlockDisplayName">{{ displayName }}</dd>
          </dl>

          <dl class="detailCommission__upperRightBlock">
            <dt class="detailCommission__upperRightBlockTitle">ステータス</dt>
            <dd class="detailCommission__upperRightBlockContent">
              <span
                :class="[
                  approval ? 'detailCommission__statusTrue' : 'detailCommission__statusFalse',
                ]"
                >{{ approval ? '承認済み' : '未承認' }}</span
              >
              <span
                v-if="approval"
                :class="[
                  release ? 'detailCommission__statusTrue' : 'detailCommission__statusFalse',
                ]"
                >{{ release ? '公開済み' : '非公開' }}</span
              >
            </dd>
            <dd class="detailCommission__upperRightBlockContent">
              <button
                class="detailCommission__inputButton"
                @click="openModalWithCommissionId(commissionId, commissionTitle)"
              >
                <font-awesome-icon :icon="['fas', !approval ? 'lock-open' : 'lock']" />{{
                  !approval ? '承認する' : '非承認にする'
                }}
              </button>
            </dd>
          </dl>
        </div>
      </div>

      <div class="detailCommission__upperCount">
        <dl class="detailCommission__upperCountBlock">
          <dt class="detailCommission__upperCountTitle">リクエスト数</dt>
          <dd class="detailCommission__upperCountContent">{{ requestCount }}</dd>
        </dl>

        <dl class="detailCommission__upperCountBlock">
          <dt class="detailCommission__upperCountTitle">いいね数</dt>
          <dd class="detailCommission__upperCountContent">{{ like }}</dd>
        </dl>

        <dl class="detailCommission__upperCountBlock">
          <dt class="detailCommission__upperCountTitle">お気に入り登録数</dt>
          <dd class="detailCommission__upperCountContent">{{ favorite }}</dd>
        </dl>
      </div>

      <dl class="detailCommission__upperMiddle">
        <dt class="detailCommission__upperMiddleTitle">コミッションの種類</dt>
        <dd class="detailCommission__upperMiddleContent">
          {{ commissionType === 'comic' ? '漫画' : '' }}
          {{ commissionType === 'illust' ? 'イラスト' : '' }}
          {{ commissionType === 'cosplay' ? 'コスプレ' : '' }}
          {{ commissionType === 'anime' ? 'アニメ' : '' }}
        </dd>
      </dl>

      <dl class="detailCommission__upperMiddle">
        <dt class="detailCommission__upperMiddleTitle">コミッションの金額</dt>
        <dd class="detailCommission__upperMiddleContent">{{ currency }}{{ commissionPrice }}</dd>
      </dl>

      <dl class="detailCommission__upperMiddle">
        <dt class="detailCommission__upperMiddleTitle">納期</dt>
        <dd class="detailCommission__upperMiddleContent">受注から{{ workPeriod }}日以内</dd>
      </dl>

      <dl class="detailCommission__upperMiddle">
        <dt class="detailCommission__upperMiddleTitle">コミッション概要</dt>
        <dd class="detailCommission__upperMiddleContent description">
          <!--
          -->{{ commissionDescription
          }}<!--
        --></dd>
      </dl>

      <dl class="detailCommission__upperMiddle">
        <dt class="detailCommission__upperMiddleTitle">作例</dt>
        <dd v-if="!!images.length" class="detailCommission__upperMiddleContent">
          <div class="detailCommission__upperMiddleImages">
            <span v-for="image in images" :key="image">
              <img :src="image" alt="" />
            </span>
          </div>
        </dd>
        <dd v-if="!images.length" class="detailCommission__upperMiddleContent">作例はありません</dd>
      </dl>

      <!-- <div class="detailCommission__lower">
        <h2 class="detailCommission__lowerTitle">アップロード済み話数</h2>
        <p class="detailCommission__lowerAttention">
          ※ Stripeに紐づけるためにはmetadataの入力が必要です。Stripeの商品画面で入力してください。
        </p>
        <p class="detailCommission__lowerAttention">
          ※ 必要なデータは、「lang」と「workAndEpisodeId」の2つです。
        </p>
        <p class="detailCommission__lowerAttention">
          ※ 「lang」は『<span>{{ lang }}</span
          >』を入力してください。
        </p>
        <p class="detailCommission__lowerAttention">
          ※ 「workAndEpisodeId」は下の話数リストにある「1-2」、「3-10」といった数値を入力します。<br />
          横のボタンを押すとクリップボードにコピーできます。
        </p>
      </div> -->
    </div>

    <CommissionApprovalModal
      :current-commission-id="currentCommissionId"
      :current-commission-title="currentCommissionTitle"
      @switch-approval="switchApproval"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, useMeta, useRoute } from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { CommissionDetailKey } from '@/compositions/key/commissionDetailKey'
import { CommissionDetailStore } from '@/compositions/commissionDetail'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'
import CommissionApprovalModal from '@/components/modals/approval/CommissionApprovalModal.vue'

export default defineComponent({
  components: {
    Breadcrumb,
    CommissionApprovalModal,
  },
  layout: 'Admin',
  setup() {
    /** composition-api **/
    const { title, titleTemplate, meta } = useMeta()
    const route = useRoute()
    /** /composition-api **/

    /** Inject **/
    const { adminDetailCommission } = inject(BreadcrumbKey) as BreadcrumbStore
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      commissionId,
      approval,
      release,
      picture,
      commissionTitle,
      commissionDescription,
      commissionType,
      commissionPrice,
      currency,
      workPeriod,
      displayName,
      requestCount,
      favorite,
      like,
      images,
      lang,
      currentCommissionId,
      currentCommissionTitle,
      initCommissionDetail,
    } = inject(CommissionDetailKey) as CommissionDetailStore
    /** /Inject **/

    /** Computed **/
    const id = computed(() => route.value.params.id)
    /** /Computed **/

    /** Created **/
    // コミッション詳細の初期化関数の呼び出し
    initCommissionDetail(id.value)
    /** /Created **/

    /** Function **/
    // Twitterから画像を取得できなかった場合の代替画像表示
    const onError = (event: { target: { src: string } }) => {
      event.target.src = require('@/assets/images/icon_default_picture.svg')
    }

    /** Function **/
    // 承認・非承認のモーダル表示
    const openModalWithCommissionId = (commissionId: number, commissionTitle: string) => {
      currentCommissionId.value = commissionId
      currentCommissionTitle.value = commissionTitle
      handleOpenModal('commissionApproval')
    }

    // 承認・非承認の切り替え
    const switchApproval = () => {
      initCommissionDetail(id.value)
    }
    /** /Function **/

    /** Meta **/
    title.value = 'コミッション詳細'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminDetailCommission,
      approval,
      release,
      commissionId,
      picture,
      commissionTitle,
      commissionDescription,
      commissionType,
      commissionPrice,
      currency,
      workPeriod,
      displayName,
      requestCount,
      favorite,
      like,
      images,
      lang,
      currentCommissionId,
      currentCommissionTitle,
      onError,
      openModalWithCommissionId,
      switchApproval,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.detailCommission {
  padding-bottom: 32px;
  &__title {
    margin-bottom: 16px;
    font-size: 2rem;
    line-height: 2;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__upper {
    max-width: 1000px;
    display: flex;
  }
  &__imageWrap {
    width: 126px;
    text-align: center;
  }
  &__image {
    margin-bottom: 16px;
    padding: 2px;
    width: 126px;
    height: 126px;
    position: relative;
    border: $border-color-lightgray solid 1px;
    > img {
      width: 120px;
      height: auto;
    }
  }
  &__upperRight {
    margin: 8px 0 0 16px;
    flex: 1;
  }
  &__upperRightHeader {
    margin-bottom: 16px;
  }
  &__upperRightBlockCommissionTitle {
    font-size: 1.8rem;
    font-weight: bold;
  }
  &__upperRightBlockDisplayName {
    margin-top: 4px;
    font-size: 1.6rem;
  }
  &__upperRightBlock {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
  &__upperRightBlockTitle {
    margin-right: 16px;
    font-size: 1.4rem;
    font-weight: normal;
  }
  &__upperRightBlockContent {
    width: 160px;
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__statusTrue {
    margin-right: 4px;
  }
  &__statusFalse {
    margin-right: 4px;
    opacity: 0.6;
  }
  &__upperCount {
    margin-bottom: 24px;
  }
  &__upperCountBlock {
    margin-bottom: 8px;
    display: flex;
  }
  &__upperCountTitle {
    width: 144px;
    font-size: 1.2rem;
    font-weight: normal;
  }
  &__upperCountContent {
    font-size: 1.8rem;
    font-weight: bold;
    flex: 1;
  }
  &__upperMiddle {
    margin-bottom: 16px;
  }
  &__upperMiddleTitle {
    margin-bottom: 4px;
    font-size: 1.2rem;
    font-weight: normal;
  }
  &__upperMiddleContent {
    font-size: 1.6rem;
    font-weight: normal;
    &.description {
      white-space: pre-wrap;
    }
  }
  &__upperMiddleImages {
    display: flex;
    img {
      width: auto;
      height: 300px;
      margin-right: 8px;
    }
  }
  &__inputButton {
    padding: 0 8px;
    width: 140px;
    height: 40px;
    font-size: 1.2rem;
    color: $font-color-darkgray;
    line-height: 38px;
    text-align: center;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:hover {
      opacity: 0.6;
    }
    svg {
      margin-right: 2px;
    }
    span {
      font-size: 1rem;
      letter-spacing: -1px;
    }
  }
  &__lower {
    margin-top: 24px;
    max-width: 800px;
  }
  &__lowerTitle {
    margin: 0 0 8px 8px;
    font-size: 1.6rem;
  }
  &__lowerAttention {
    margin: 0 0 4px 16px;
    padding-left: 1.3rem;
    font-size: 1.3rem;
    line-height: 1.2;
    text-indent: -1.3rem;
    span {
      font-size: 1.8rem;
      color: $font-color-red;
    }
  }
}
</style>
