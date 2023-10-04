<template>
  <div>
    <Loading v-if="processingStripe" page-type="full" />
    <section class="comicEpisodes">
      <ul class="comicEpisodes__list">
        <li v-if="!episodesWithLatestBuy.length" class="comicEpisodes__parts">
          {{ $t('comic.noneEpisode') }}
        </li>
        <li
          v-for="episode in episodesWithLatestBuy"
          :key="episode.episodeId"
          class="comicEpisodes__parts"
          @click="
            clickEpisodePreview(
              episode.episodeId,
              `${workId}-${episode.episodeId}`,
              episode.episodePrice,
              episode.customerCreated
            )
          "
        >
          <dl class="comicEpisodes__title">
            <dt class="comicEpisodes__titleNum">
              {{ episode.episodeNum }}
            </dt>
            <dd class="comicEpisodes__titleName">
              {{ episode.episodeTitle }}
            </dd>
          </dl>
          <div class="comicEpisodes__right">
            <dl class="comicEpisodes__rightParts">
              <dt class="comicEpisodes__rightPartsTitle">{{ $t('comic.update') }}:</dt>
              <dd class="comicEpisodes__rightPartsContent">
                {{ episode.createdAt.toDate().getFullYear() }}/{{
                  ('0' + (episode.createdAt.toDate().getMonth() + 1)).slice(-2)
                }}/{{ ('0' + episode.createdAt.toDate().getDate()).slice(-2) }}
              </dd>
            </dl>
            <dl class="comicEpisodes__rightParts">
              <dt class="comicEpisodes__rightPartsTitle">
                <font-awesome-icon :icon="['fas', 'thumbs-up']" />{{ $t('comic.like') }}:
              </dt>
              <dd class="comicEpisodes__rightPartsContent">
                {{ episode.like }}
              </dd>
            </dl>
          </div>
          <div class="comicEpisodes__purchase">
            <p
              v-if="
                (searchCreatorId.includes(state.creatorId.value) && state.creatorId.value !== 0) ||
                episode.episodePrice === 0
              "
              class="comicEpisodes__freeInner"
            >
              {{ $t('comic.free') }}
            </p>
            <dl
              v-if="
                (!searchCreatorId.includes(state.creatorId.value) || state.creatorId.value === 0) &&
                episode.episodePrice > 0 &&
                (!episode.customerCreated ||
                  Number(getSevenDaysLater(episode.customerCreated)) <= initTime)
              "
              class="comicEpisodes__purchaseInnerWrap"
            >
              <dd class="comicEpisodes__purchaseInnerUpper">
                {{ $t(`comic.price1`) }}{{ episode.episodePrice }}{{ $t(`comic.price2`) }}
              </dd>
              <dd class="comicEpisodes__purchaseInnerLower">
                {{ $t('comic.goToPay') }}
              </dd>
            </dl>
            <dl
              v-if="
                (!searchCreatorId.includes(state.creatorId.value) || state.creatorId.value === 0) &&
                episode.episodePrice > 0 &&
                Number(getSevenDaysLater(episode.customerCreated)) > initTime
              "
              class="comicEpisodes__purchasedInnerWrap"
            >
              <dd class="comicEpisodes__purchasedInnerUpper">
                {{ $t('comic.purchased') }}
              </dd>
              <dd class="comicEpisodes__purchasedInnerLower">
                {{ getReadingPeriod(episode.customerCreated) }}
              </dd>
            </dl>
          </div>
        </li>
      </ul>
    </section>
    <ComicPreview
      v-if="isPreview"
      :images="previewImages"
      user-type="user"
      :work-id="Number(workId)"
      :episode-id="episodeId"
      @preview-close="episodePreviewClose"
      @reload="reload(ctx)"
    />
    <IsNotSignIn />
    <IsNotVerified />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted } from '@nuxtjs/composition-api'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { ComicDetailKey } from '@/compositions/key/comicDetailKey'
import { ComicDetailStore } from '@/compositions/comicDetail'
import { StripeKey } from '@/compositions/key/stripeKey'
import { StripeStore } from '@/compositions/stripe'
import Loading from '@/components/Loading.vue'
import ComicPreview from '@/components/ComicPreview.vue'
import IsNotSignIn from '@/components/modals/account/IsNotSignInModal.vue'
import IsNotVerified from '@/components/modals/account/IsNotVerifiedModal.vue'
import { injectGlobalState } from '@/utils/states/user'
import { getReadingPeriod, getSevenDaysLater } from '@/utils/util'

export default defineComponent({
  components: {
    Loading,
    ComicPreview,
    IsNotSignIn,
    IsNotVerified,
  },
  props: {
    workId: {
      type: Number,
      required: true,
    },
  },
  setup(props, ctx) {
    /** Inject **/
    const state = injectGlobalState()
    const { isAccountSignIn, isVerified } = inject(AccountKey) as AccountStore
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      searchCreatorId,
      episodesWithLatestBuy,
      previewImages,
      episodeId,
      isPreview,
      initComicEpisodesVariables,
      initComicEpisodes,
      episodePreview,
      episodePreviewClose,
      reload,
    } = inject(ComicDetailKey) as ComicDetailStore
    const { processingStripe, handleClickStripe } = inject(StripeKey) as StripeStore
    /** /Inject **/

    /** Computed **/
    const initTime = computed(() => Date.now())
    /** /Computed **/

    /** Created **/
    // 値を初期化する関数の呼び出し
    initComicEpisodesVariables()

    // 作品詳細の初期化関数の呼び出し
    initComicEpisodes(ctx, props.workId)
    /** /Created **/

    /** LifeCycle **/
    let url: string
    onMounted(() => {
      url = window.location.href
    })
    /** /LifeCycle **/

    /** Function **/
    // ログイン（メールアドレスで会員登録の場合は認証も含む）している場合は話数が開く
    const clickEpisodePreview = (
      id: number,
      workAndEpisodeId: string,
      price: number,
      customerCreated: string
    ) => {
      const nowDate = new Date().getTime()
      if (!isAccountSignIn.value) {
        handleOpenModal('isNotSignIn')
      } else if (state.provider.value === 'password' && !isVerified()) {
        handleOpenModal('isNotVerified')
      } else if (
        (!searchCreatorId.value.includes(state.creatorId.value) || state.creatorId.value === 0) &&
        price > 0 &&
        (!customerCreated || Number(getSevenDaysLater(customerCreated)) <= nowDate)
      ) {
        handleClickStripe(workAndEpisodeId, state.language.value, url)
      } else {
        episodePreview(id)
      }
    }
    /** /Function **/

    return {
      getSevenDaysLater,
      getReadingPeriod,
      ctx,
      state,
      searchCreatorId,
      episodesWithLatestBuy,
      episodeId,
      previewImages,
      isPreview,
      initComicEpisodes,
      episodePreviewClose,
      clickEpisodePreview,
      reload,
      processingStripe,
      initTime,
    }
  },
})
</script>

<style lang="scss" scoped>
.comicEpisodes {
  width: 100%;
  &__list {
    border-top: 1px solid $border-color-gray;
  }
  &__parts {
    padding: 8px 16px;
    width: 100%;
    height: 100%;
    color: $font-color-white;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid $border-color-gray;
    background: $background-color-darkgray-opacity;
    cursor: pointer;
  }
  &__titleNum {
    font-weight: normal;
  }
  &__titleName {
    font-weight: bold;
  }
  &__right {
    margin-left: 16px;
  }
  &__rightParts {
    display: flex;
    justify-content: flex-end;
  }
  &__rightPartsTitle {
    font-weight: normal;
    font-size: 1.2rem;
  }
  &__rightPartsContent {
    margin-left: 4px;
    font-size: 1.2rem;
  }
  &__purchase {
    margin: 8px 0;
    border-radius: 4px;
    border: $border-color-lightgray solid 1px;
    background: $background-color-gray-opacity;
  }
  &__freeInner {
    color: $font-color-white;
    font-weight: bold;
  }
  &__purchaseInnerWrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__purchaseInnerUpper {
    color: $font-color-white;
    font-weight: bold;
  }
  &__purchaseInnerLower {
    color: $font-color-white;
  }
  &__purchasedInnerWrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__purchasedInnerUpper {
    color: $font-color-white;
    font-weight: bold;
  }
  &__purchasedInnerLower {
    color: $font-color-red;
    font-weight: bold;
  }
}
.pc {
  .comicEpisodes {
    &__parts {
      &:hover {
        opacity: 0.6;
      }
    }
    &__title {
      line-height: 30px;
      flex: 1;
    }
    &__titleNum {
      font-size: 1.4rem;
    }
    &__titleName {
      height: 40px;
      line-height: 1.4;
      font-size: 1.4rem;
    }
    &__right {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    &__rightParts {
      line-height: 1.6;
    }
    &__purchase {
      margin-left: 18px;
      width: 176px;
    }
    &__freeInner {
      height: 100%;
      font-size: 1.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__purchaseInnerWrap {
      height: 100%;
      flex-direction: column;
    }
    &__purchaseInnerUpper {
      font-size: 1.6rem;
    }
    &__purchaseInnerLower {
      margin-top: 8px;
      font-size: 1.2rem;
    }
    &__purchasedInnerWrap {
      height: 100%;
      flex-direction: column;
    }
    &__purchasedInnerUpper {
      font-size: 1.6rem;
    }
    &__purchasedInnerLower {
      margin-top: 8px;
      font-size: 1.2rem;
    }
  }
}
.sp {
  .comicEpisodes {
    &__parts {
      &:active {
        opacity: 0.6;
      }
    }
    &__title {
      padding: 8px 0 0;
      width: 100%;
      line-height: 22px;
    }
    &__titleNum {
      font-size: 1.4rem;
    }
    &__titleName {
      height: 44px;
      font-size: 1.3rem;
    }
    &__right {
      margin: 0;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
    &__rightParts {
      line-height: 30px;
      margin-left: 16px;
    }
    &__purchase {
      padding: 4px 0;
      width: 100%;
    }
    &__freeInner {
      font-size: 1.4rem;
      text-align: center;
    }
    &__purchaseInnerUpper {
      font-size: 1.4rem;
    }
    &__purchaseInnerLower {
      margin-left: 8px;
      font-size: 1.4rem;
    }
    &__purchasedInnerUpper {
      font-size: 1.4rem;
    }
    &__purchasedInnerLower {
      margin-left: 8px;
      font-size: 1.4rem;
    }
  }
}
</style>
