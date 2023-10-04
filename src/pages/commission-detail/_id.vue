<template>
  <div>
    <div class="detailCommission">
      <Loading v-if="processing" page-type="normal" />
      <h1 class="detailCommission__title">{{ $t('commission.title') }}</h1>
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
            <dd class="detailCommission__upperRightBlockDisplayName">
              <nuxt-link :to="`/creator/${creatorId}`">{{ displayName }}</nuxt-link>
            </dd>
          </dl>

          <div class="detailCommission__upperCount">
            <dl class="detailCommission__upperCountBlock">
              <dt class="detailCommission__upperCountTitle">
                <font-awesome-icon :icon="['fas', 'file-export']" />{{
                  $t('commission.requestCount')
                }}
              </dt>
              <dd class="detailCommission__upperCountContent">{{ requestCount }}</dd>
            </dl>

            <dl class="detailCommission__upperCountBlock">
              <dt class="detailCommission__upperCountTitle">
                <font-awesome-icon :icon="['fas', 'thumbs-up']" />{{ $t('commission.likeCount') }}
              </dt>
              <dd class="detailCommission__upperCountContent">{{ like }}</dd>
            </dl>

            <dl class="detailCommission__upperCountBlock">
              <dt class="detailCommission__upperCountTitle">
                <font-awesome-icon :icon="['fas', 'heart']" />{{ $t('commission.favoriteCount') }}
              </dt>
              <dd class="detailCommission__upperCountContent">{{ favorite }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <dl class="detailCommission__upperMiddle">
        <dt class="detailCommission__upperMiddleTitle">{{ $t('commission.type') }}</dt>
        <dd class="detailCommission__upperMiddleContent">
          {{ commissionType === 'comic' ? $t('commission.typeComic') : '' }}
          {{ commissionType === 'illust' ? $t('commission.typeIllust') : '' }}
          {{ commissionType === 'cosplay' ? $t('commission.typeCosplay') : '' }}
          {{ commissionType === 'anime' ? $t('commission.typeAnime') : '' }}
        </dd>
      </dl>

      <dl class="detailCommission__upperMiddle">
        <dt class="detailCommission__upperMiddleTitle">{{ $t('commission.price') }}</dt>
        <dd class="detailCommission__upperMiddleContent">{{ currency }}{{ commissionPrice }}</dd>
      </dl>

      <dl class="detailCommission__upperMiddle">
        <dt class="detailCommission__upperMiddleTitle">{{ $t('commission.workPeriod') }}</dt>
        <dd class="detailCommission__upperMiddleContent">
          {{ $t('commission.workPeriodFront') }}{{ workPeriod
          }}{{ $t('commission.workPeriodBack') }}
        </dd>
      </dl>

      <dl class="detailCommission__upperDescription">
        <dt class="detailCommission__upperDescriptionTitle">{{ $t('commission.description') }}</dt>
        <dd class="detailCommission__upperDescriptionContent description">
          <!--
          -->{{ commissionDescription
          }}<!--
        --></dd>
      </dl>

      <dl class="detailCommission__upperImage">
        <dt class="detailCommission__upperImageTitle">{{ $t('commission.image') }}</dt>
        <dd v-if="!!images.length" class="detailCommission__upperImageContent">
          <p class="detailCommission__upperImageCaption">{{ $t('commission.imageCaption') }}</p>
          <div class="detailCommission__upperImageImages">
            <span
              v-for="image in images"
              :key="image"
              class="detailCommission__upperImageImage"
              @click="clickSampleImage(image)"
            >
              <img :src="image" alt="" />
              <span class="detailCommission__icon">
                <font-awesome-icon :icon="['fas', 'search-plus']" />
              </span>
            </span>
          </div>
        </dd>
        <dd v-if="!images.length" class="detailCommission__upperImageContent">
          {{ $t('commission.nothingImage') }}
        </dd>
      </dl>
      <div v-if="!isVerified()" class="detailCommission__requestButtonArea">
        <p>{{ $t('commission.guestCaption') }}</p>
      </div>
      <div
        v-if="isVerified() && myCreatorId !== creatorId"
        class="detailCommission__requestButtonArea"
      >
        <button
          class="detailCommission__requestButton"
          @click="handleOpenModal('commissionRequest')"
        >
          <font-awesome-icon :icon="['fas', 'handshake']" />{{ $t('commission.requestButton') }}
        </button>
      </div>
      <div
        v-if="isVerified() && myCreatorId === creatorId"
        class="detailCommission__requestButtonArea"
      >
        <p>{{ $t('commission.editCaption') }}</p>
      </div>
    </div>
    <CommissionSampleModal />
    <RequestModal
      :id="commissionId"
      :title="commissionTitle"
      :type="commissionType"
      :price="commissionPrice"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  useContext,
  useMeta,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { CommissionDetailKey } from '@/compositions/key/commissionDetailKey'
import { CommissionDetailStore } from '@/compositions/commissionDetail'
import Loading from '@/components/Loading.vue'
import CommissionSampleModal from '@/components/modals/commissionDetail/CommissionSampleModal.vue'
import RequestModal from '@/components/modals/commissionRequest/RequestModal.vue'

export default defineComponent({
  components: {
    Loading,
    CommissionSampleModal,
    RequestModal,
  },
  setup() {
    /** composition-api **/
    const { app } = useContext()
    const { title, meta } = useMeta()
    const route = useRoute()
    /** /composition-api **/

    /** Inject **/
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    const { isVerified } = inject(AccountKey) as AccountStore
    const {
      processing,
      myCreatorId,
      commissionId,
      picture,
      creatorId,
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
      initCommissionDetail,
      viewSampleImage,
    } = inject(CommissionDetailKey) as CommissionDetailStore
    /** /Inject **/

    /** Computed **/
    const id = computed(() => route.value.params.id)
    /** /Computed **/

    /** Created **/
    // 作品一覧の通信を初期化する関数を呼び出し
    initCommissionDetail(id.value)
    /** /Created **/

    /** Watch **/
    // commissionTitleの値が更新されたらmetaのdescriptionに追加
    watch(commissionTitle, () => {
      meta.value.push(
        {
          hid: 'description',
          name: 'description',
          content: commissionTitle.value,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: commissionTitle.value,
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: commissionTitle.value,
        }
      )
    })

    // pictureの値が更新されたらmetaのimageに追加
    watch(picture, () => {
      meta.value.push({
        hid: 'twitter:image',
        property: 'twitter:image',
        content: picture.value,
      })
    })
    /** /Watch **/

    /** Function **/
    // Twitterから画像を取得できなかった場合の代替画像表示
    const onError = (event: { target: { src: string } }) => {
      event.target.src = require('@/assets/images/icon_default_picture.svg')
    }

    // 作例をクリックしてモーダルを開く
    const clickSampleImage = (image: string) => {
      viewSampleImage(image)
      handleOpenModal('commissionSample')
    }
    /** /Function **/

    /** Meta **/
    title.value = app.i18n.t('commission.title').toString()
    meta.value = [
      { hid: 'og:type', property: 'og:type', content: 'article' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: `${app.i18n.t('commission.title').toString()} | Pixage`,
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: `https://pixage.app/commission-detail/${id.value}`,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: '/icon.png',
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary',
      },
      {
        hid: 'twitter:site',
        property: 'twitter:site',
        content: '@pixage_inc',
      },
      {
        hid: 'twitter:domain',
        property: 'twitter:domain',
        content: 'pixage.app',
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: `${app.i18n.t('commission.title').toString()} | Pixage`,
      },
    ]
    /** /Meta **/

    return {
      handleOpenModal,
      isVerified,
      processing,
      myCreatorId,
      commissionId,
      creatorId,
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
      onError,
      clickSampleImage,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.detailCommission {
  margin: auto;
  &__title {
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
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
  &__upperRightHeader {
    margin-bottom: 16px;
  }
  &__upperRightBlockCommissionTitle {
    font-weight: bold;
  }
  &__upperRightBlockDisplayName {
    margin-top: 8px;
    a {
      text-decoration: underline;
    }
  }
  &__upperRightBlock {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
  &__upperCountBlock {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
  &__upperCountTitle {
    width: 92px;
    font-size: 1.2rem;
    color: $font-color-lightgray;
    font-weight: normal;
  }
  &__upperCountContent {
    margin-left: 4px;
    font-size: 1.2rem;
    color: $font-color-white;
  }
  &__upperMiddle {
    margin-bottom: 16px;
  }
  &__upperMiddleTitle {
    font-size: 1.2rem;
    font-weight: normal;
  }
  &__upperMiddleContent {
    font-weight: normal;
  }
  &__upperDescriptionTitle {
    margin-bottom: 4px;
    line-height: 1.6;
    font-weight: normal;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__upperDescriptionContent {
    color: $font-color-black;
    font-weight: normal;
    white-space: pre-wrap;
    border-radius: 4px;
    background: $background-color-lightgray-opacity;
  }
  &__upperImageTitle {
    margin-bottom: 8px;
    font-size: 1.4rem;
    line-height: 1.6;
    font-weight: normal;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__upperImageContent {
    font-size: 1.4rem;
    font-weight: normal;
  }
  &__upperImageCaption {
    margin-bottom: 8px;
  }
  &__upperImageImages {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  &__upperImageImage {
    margin: 0 4px;
    position: relative;
    border: $border-color-lightgray solid 1px;
    background: $background-color-darkgray-opacity;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border: $border-color-darkgray solid 2px;
    }
  }
  &__icon {
    padding: 4px;
    width: 48px;
    height: 48px;
    font-size: 28px;
    color: $font-color-black;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 2px;
    bottom: 2px;
    border-radius: 4px 0 0 0;
    background: $background-color-lightgray-opacity;
  }
  &__requestButtonArea {
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: sticky;
    left: 0;
    background: $background-color-default-opacity;
  }
  &__requestButton {
    width: 200px;
    height: 40px;
    font-size: 1.8rem;
    color: $font-color-darkgray;
    line-height: 38px;
    text-align: center;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    svg {
      margin-right: 4px;
    }
  }
}
.pc {
  .detailCommission {
    margin: auto;
    width: 800px;
    &__title {
      margin-bottom: 16px;
      font-size: 2rem;
      line-height: 2;
    }
    &__upper {
      max-width: 1000px;
      display: flex;
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
    }
    &__upperRightBlockDisplayName {
      font-size: 1.6rem;
      a:hover {
        text-decoration: none;
      }
    }
    &__upperRightBlock {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }
    &__upperCount {
      margin-bottom: 24px;
    }
    &__upperMiddle {
      display: flex;
      align-items: center;
    }
    &__upperMiddleTitle {
      width: 140px;
    }
    &__upperMiddleContent {
      font-size: 1.6rem;
    }
    &__upperDescription {
      margin-bottom: 24px;
    }
    &__upperDescriptionTitle {
      font-size: 1.4rem;
    }
    &__upperDescriptionContent {
      padding: 16px;
    }
    &__upperImage {
      margin-bottom: 16px;
    }
    &__upperImageTitle {
      margin-bottom: 8px;
      font-size: 1.4rem;
      line-height: 1.6;
      font-weight: normal;
      border-bottom: $border-color-lightgray solid 1px;
    }
    &__upperImageContent {
      font-size: 1.4rem;
      font-weight: normal;
    }
    &__upperImageImages {
      display: flex;
      align-items: center;
    }
    &__upperImageImage {
      width: 380px;
      height: 380px;
    }
    &__requestButtonArea {
      bottom: 0;
    }
    &__requestButton {
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
.sp {
  .detailCommission {
    width: 100%;
    &__title {
      margin: 0 8px 16px;
      font-size: 1.4rem;
      line-height: 1.6;
    }
    &__imageWrap {
      margin: 0 auto;
    }
    &__upperRight {
      margin: 0 16px 16px;
    }
    &__upperRightHeader {
      margin-bottom: 16px;
    }
    &__upperRightBlockCommissionTitle {
      font-size: 1.6rem;
      line-height: 1.6;
    }
    &__upperRightBlockDisplayName {
      font-size: 1.4rem;
      a:active {
        text-decoration: none;
      }
    }
    &__upperRightBlock {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }
    &__upperCount {
      margin-bottom: 16px;
    }
    &__upperMiddle {
      margin: 0 16px 16px;
    }
    &__upperMiddleTitle {
      margin-bottom: 4px;
    }
    &__upperMiddleContent {
      font-size: 1.4rem;
      font-weight: bold;
    }
    &__upperDescription {
      margin: 0 16px 16px;
    }
    &__upperDescriptionTitle {
      font-size: 1.2rem;
    }
    &__upperDescriptionContent {
      padding: 12px;
    }
    &__upperImage {
      margin: 0 16px 16px;
    }
    &__upperImageTitle {
      margin-bottom: 8px;
      font-size: 1.4rem;
      line-height: 1.6;
      font-weight: normal;
      border-bottom: $border-color-lightgray solid 1px;
    }
    &__upperImageContent {
      font-size: 1.4rem;
      font-weight: normal;
    }
    &__upperImageImages {
      display: flex;
      align-items: center;
    }
    &__upperImageImage {
      margin: 0 4px;
      width: calc(50% - 8px);
      padding-top: calc(50% - 8px);
      display: block;
      position: relative;
      img {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    &__requestButtonArea {
      bottom: calc(56px + env(safe-area-inset-bottom));
    }
    &__requestButton {
      &:active {
        opacity: 0.6;
      }
    }
  }
}
</style>
