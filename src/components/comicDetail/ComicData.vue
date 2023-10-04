<template>
  <section class="comicData">
    <div class="comicData__wrap">
      <div class="comicData__left">
        <img
          :src="thumbnail ? thumbnail : require('@/assets/images/thumbnail_noImage.jpg')"
          :alt="workTitle"
        />
      </div>
      <div class="comicData__right">
        <h1 class="comicData__title">{{ workTitle }}</h1>
        <p v-if="official" class="comicData__official">
          <img :src="require('@/assets/images/logo_official.svg')" :alt="$t('comic.official')" />{{
            $t('comic.official')
          }}
        </p>
        <div class="comicData__share">
          <ShareNetwork
            network="twitter"
            :url="`https://pixage.app/comic-detail/${workId}`"
            :title="`${workTitle} | Pixage`"
            :description="workDescription"
            quote=""
            :hashtags="`${workTitle},Pixage`"
            twitter-user="pixage_inc"
          >
            <span class="comicData__shareIcon"
              ><font-awesome-icon :icon="['fab', 'twitter']"
            /></span>
            <span class="comicData__shareText">{{ $t('comic.share') }}</span>
          </ShareNetwork>
        </div>
        <dl class="comicData__count">
          <dt class="comicData__countTitle">
            <font-awesome-icon :icon="['fas', 'thumbs-up']" />{{ $t('comic.totalLike') }}:
          </dt>
          <dd class="comicData__countNum">{{ totalLike }}</dd>
        </dl>
        <dl class="comicData__count">
          <dt class="comicData__countTitle">
            <font-awesome-icon :icon="['fas', 'heart']" />{{ $t('comic.favorite') }}:
          </dt>
          <dd class="comicData__countNum">{{ favorite }}</dd>
        </dl>
        <dl class="comicData__caption">
          <dt class="comicData__captionTitle">{{ $t('comic.creator') }}</dt>
          <dd v-if="creator.all !== ''" class="comicData__captionCreator">
            <nuxt-link :to="`/creator/${creatorIds.all}`">{{ creator.all }}</nuxt-link>
          </dd>
          <dd v-if="creator.all === ''" class="comicData__captionCreator">
            {{ $t('comic.author') }}:
            <nuxt-link :to="`/creator/${creatorIds.story}`">{{ creator.story }}</nuxt-link>
          </dd>
          <dd v-if="creator.all === ''" class="comicData__captionCreator">
            {{ $t('comic.drawing') }}:
            <nuxt-link :to="`/creator/${creatorIds.drawing}`">{{ creator.drawing }}</nuxt-link>
          </dd>
        </dl>
        <dl class="comicData__caption">
          <dt class="comicData__captionTitle">{{ $t('comic.genre') }}</dt>
          <dd class="comicData__captionName">
            {{ genre }}
          </dd>
        </dl>
        <div v-if="isAccountSignIn && isVerified()" class="comicData__favoriteButtonWrap">
          <button
            :class="['comicData__favoriteButton', { on: isFavoriteWorks }]"
            @click="clickFavorite(ctx, workId)"
          >
            <font-awesome-icon
              :icon="['fas', 'heart']"
              :class="['comicData__favoriteIcon', { on: isFavoriteWorks }]"
            />{{ !isFavoriteWorks ? $t('comic.addFavorite') : $t('comic.removeFavorite') }}
          </button>
        </div>
      </div>
    </div>
    <p class="comicData__description">{{ workDescription }}</p>
  </section>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import { ComicDetailKey } from '@/compositions/key/comicDetailKey'
import { ComicDetailStore } from '@/compositions/comicDetail'

export default defineComponent({
  props: {
    workId: {
      type: Number,
      required: true,
    },
  },
  setup(props, ctx) {
    /** Inject **/
    const { isAccountSignIn, isVerified } = inject(AccountKey) as AccountStore
    const {
      thumbnail,
      workTitle,
      workDescription,
      creator,
      creatorIds,
      genre,
      totalLike,
      favorite,
      isFavoriteWorks,
      official,
      initComicDataVariables,
      initComicData,
      clickFavorite,
    } = inject(ComicDetailKey) as ComicDetailStore
    /** /Inject **/

    /** Created **/
    // 値を初期化する関数の呼び出し
    initComicDataVariables()

    // 作品詳細の初期化関数の呼び出し
    initComicData(ctx, props.workId)
    /** /Created **/

    return {
      ctx,
      isAccountSignIn,
      isVerified,
      thumbnail,
      workTitle,
      workDescription,
      creator,
      creatorIds,
      genre,
      totalLike,
      favorite,
      isFavoriteWorks,
      official,
      initComicData,
      clickFavorite,
    }
  },
})
</script>

<style lang="scss" scoped>
.comicData {
  margin-bottom: 24px;
  width: 100%;
  &__left {
    width: 220px;
    img {
      width: 100%;
      height: auto;
      box-shadow: 0 0 8px 0 $glow-color;
    }
  }
  &__title {
    margin-bottom: 8px;
    color: $font-color-white;
    line-height: 1.4;
    font-weight: bold;
  }
  &__official {
    margin-bottom: 16px;
    font-size: 1.4rem;
    font-weight: bold;
    img {
      margin-right: 4px;
      width: auto;
      height: 24px;
    }
  }
  &__share {
    margin-bottom: 16px;
    .share-network-twitter {
      height: 32px;
      display: inline-flex;
      background: $background-color-twitter;
    }
  }
  &__shareIcon {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    svg {
      width: 20px;
      height: auto;
    }
  }
  &__shareText {
    padding: 0 8px;
    line-height: 32px;
  }
  &__count {
    margin-bottom: 8px;
    display: flex;
  }
  &__countTitle {
    font-size: 1.2rem;
    color: $font-color-lightgray;
    font-weight: normal;
  }
  &__countNum {
    margin-left: 4px;
    font-size: 1.2rem;
    color: $font-color-white;
  }
  &__caption {
    margin-top: 16px;
  }
  &__captionTitle {
    margin-bottom: 4px;
    color: $font-color-lightgray;
    font-weight: normal;
  }
  &__captionName {
    color: $font-color-white;
  }
  &__captionCreator {
    margin-bottom: 8px;
    color: $font-color-white;
  }
  &__favoriteButtonWrap {
    margin-top: 16px;
    height: 40px;
  }
  &__favoriteButton {
    height: 40px;
    font-size: 1.6rem;
    color: $font-color-darkgray;
    text-align: center;
    border-radius: 8px;
    border: 1px solid $button-color-metal-border;
    background: $button-color-metal-bg;
    box-shadow: inset 1px 1px 1px $glow-color;
    &.on {
      height: 39px;
      padding: 1px 0 0 1px;
      border: none;
      background: $button-color-metal-on-bg;
      box-shadow: inset 2px 2px 4px $shadow-color;
      transform: translate(1px, 1px);
    }
  }
  &__favoriteIcon {
    margin-right: 4px;
    &.on {
      color: $icon-color-favorite;
    }
  }
  &__description {
    color: $font-color-white;
    line-height: 1.4;
  }
}
.pc {
  .comicData {
    &__wrap {
      display: flex;
    }
    &__left {
      margin-right: 24px;
    }
    &__right {
      flex: 1;
    }
    &__title {
      font-size: 2.4rem;
    }
    &__captionTitle {
      font-size: 1.6rem;
    }
    &__captionName,
    &__captionCreator {
      font-size: 1.6rem;
      a {
        text-decoration: underline;
        &:hover {
          text-decoration: none;
        }
      }
    }
    &__favoriteButton {
      width: 200px;
      &.on {
        width: 199px;
      }
    }
    &__description {
      margin-top: 16px;
      font-size: 1.6rem;
    }
  }
}
.sp {
  .comicData {
    &__wrap {
      display: block;
    }
    &__left {
      margin: 0 auto 16px;
    }
    &__right {
      padding: 0 16px 16px;
    }
    &__title {
      font-size: 2rem;
    }
    &__captionTitle {
      font-size: 1.4rem;
    }
    &__captionName,
    &__captionCreator {
      font-size: 1.4rem;
      a {
        text-decoration: underline;
        &:active {
          text-decoration: none;
        }
      }
    }
    &__favoriteButton {
      width: 100%;
      &.on {
        width: calc(100% - 1px);
      }
    }
    &__description {
      margin: 16px 16px 0;
      font-size: 1.4rem;
    }
  }
}
</style>
