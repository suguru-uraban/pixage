<template>
  <article class="creator">
    <Loading v-if="processing" page-type="normal" />
    <h2 class="creator__title">{{ $t('creatorPage.title') }}</h2>
    <div class="creator__wrap">
      <div class="creator__imageWrap">
        <div class="creator__image">
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
      <div class="creator__userWrap">
        <div class="creator__displayNameArea">
          <p class="creator__displayName">{{ displayName }}</p>
        </div>
        <ul class="creator__userDataList">
          <li class="creator__userProvider">
            {{ viewIsCreator(isCreator, isActive) }}
          </li>
        </ul>
        <div v-if="pr !== ''" class="creator__prWrap">
          <p class="creator__pr">{{ pr }}</p>
        </div>
      </div>
    </div>
    <section>
      <h3 class="creator__subTitle">{{ $t('creatorPage.subTitle2') }}</h3>
      <div v-if="commissions.length" class="creator__commissionWrap">
        <ul class="creator__commissionBody">
          <li
            v-for="commission in commissions"
            :key="commission.commissionId"
            class="creator__commissionParts"
          >
            <nuxt-link :to="`/commission-detail/${commission.commissionId}`">
              <p class="creator__commissionTitle">{{ commission.ja.commissionTitle }}</p>
              <div class="creator__commissionRightWrap">
                <p class="creator__commissionType">
                  {{
                    commission.commissionType === 'comic' ? $t('creatorPage.commissionComic') : ''
                  }}
                  {{
                    commission.commissionType === 'illust' ? $t('creatorPage.commissionIllust') : ''
                  }}
                  {{
                    commission.commissionType === 'cosplay'
                      ? $t('creatorPage.commissionCosplay')
                      : ''
                  }}
                  {{
                    commission.commissionType === 'anime' ? $t('creatorPage.commissionAnime') : ''
                  }}
                </p>
                <p class="creator__commissionPrice">
                  {{ commission.ja.currency }}{{ commission.ja.commissionPrice.toLocaleString() }}
                </p>
              </div>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </section>
    <section v-if="isCreator === 'all' || isCreator === 'storyOnly' || isCreator === 'drawingOnly'">
      <h3 class="creator__subTitle">{{ $t('creatorPage.subTitle1') }}</h3>
      <ul class="creator__listBody">
        <li v-if="works.length === 0" class="creator__listCaption">
          {{ $t('list.nothingComic') }}
        </li>
        <li v-for="work in works" :key="work.workId" class="creator__listParts">
          <img
            v-if="work.official"
            :src="require('@/assets/images/logo_official.svg')"
            :alt="$t('list.official')"
            class="creator__listOfficial"
          />
          <nuxt-link :to="`/comic-detail/${work.workId}`">
            <img
              :src="
                work.ja.thumbnail
                  ? work.ja.thumbnail
                  : require('@/assets/images/thumbnail_noImage.jpg')
              "
              :alt="work.ja.title"
            />
          </nuxt-link>
        </li>
      </ul>
    </section>
  </article>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  useContext,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api'
import { CreatorPageKey } from '@/compositions/key/creatorPageKey'
import { CreatorPageStore } from '@/compositions/creatorPage'

export default defineComponent({
  setup() {
    /** composition-api **/
    const { app } = useContext()
    const { title, meta } = useMeta()
    const route = useRoute()
    /** /composition-api **/

    /** Inject **/
    const {
      processing,
      displayName,
      picture,
      isCreator,
      isActive,
      pr,
      works,
      commissions,
      initCreator,
      viewIsCreator,
    } = inject(CreatorPageKey) as CreatorPageStore
    /** /Inject **/

    /** Computed **/
    const id = computed(() => route.value.params.id)
    /** /Computed **/

    /** Created **/
    // クリエイターデータ初期化の呼び出し
    initCreator(id.value)
    /** /Created **/

    /** Function **/
    // Twitterから画像を取得できなかった場合の代替画像表示
    const onError = (event: { target: { src: string } }) => {
      event.target.src = require('@/assets/images/icon_default_picture.svg')
    }
    /** /Function **/

    /** Meta **/
    title.value = app.i18n.t('creatorPage.title').toString()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      { hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: `${displayName.value} | Pixage` },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '',
      },
      { hid: 'og:url', property: 'og:url', content: `https://pixage.app/creator/${id.value}` },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]
    /** /Meta **/

    return {
      processing,
      displayName,
      picture,
      isCreator,
      isActive,
      pr,
      works,
      commissions,
      viewIsCreator,
      onError,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.creator {
  margin: auto;
  &__title {
    padding: 8px;
    font-size: 2rem;
    font-weight: bold;
    border-bottom: $border-color-gray solid 1px;
  }
  &__wrap {
    width: 100%;
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
    border: $border-color-gray solid 1px;
    > img {
      width: 120px;
      height: auto;
    }
  }
  &__displayNameArea {
    margin-bottom: 8px;
    min-height: 40px;
    display: flex;
    align-items: center;
  }
  &__displayName {
    margin-right: 8px;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1.4;
  }
  &__userDataList {
    margin-bottom: 16px;
  }
  &__prWrap {
    padding: 8px;
    border-radius: 4px;
    background: $background-color-darkgray-opacity;
  }
  &__pr {
    white-space: pre-wrap;
  }
  &__userProvider {
    font-size: 1.6rem;
    color: $font-color-white;
  }
  &__subTitle {
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__listBody {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  &__listCaption {
    padding: 16px 8px 0;
  }
  &__listParts {
    padding: 0 8px 16px;
    position: relative;
    a {
      display: block;
      img {
        height: auto;
        box-shadow: 0 0 8px 0 $glow-color;
      }
    }
  }
  &__listOfficial {
    width: auto;
    position: absolute;
    left: 4px;
    z-index: 1;
  }
  &__commissionWrap {
    margin-bottom: 24px;
  }
  &__commissionBody {
    padding: 0 8px;
    width: 100%;
  }
  &__commissionParts {
    margin-bottom: 8px;
    position: relative;
    a {
      padding: 8px;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      border-radius: 4px;
      background: $background-color-darkgray-block-opacity;
      box-shadow: inset 0 0 4px 0 $glow-color;
    }
  }
  &__commissionTitle {
    font-weight: bold;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  &__commissionRightWrap {
    display: flex;
    align-items: center;
  }
  &__commissionType {
    width: 80px;
    text-align: center;
  }
  &__commissionPrice {
    line-height: 1;
    font-size: bold;
    text-align: center;
    border-radius: 4px;
    border: $border-color-white solid 1px;
  }
}
.pc {
  .creator {
    width: 800px;
    &__title {
      margin-bottom: 8px;
    }
    &__wrap {
      margin-bottom: 16px;
      display: flex;
    }
    &__imageWrap {
      margin-right: 24px;
    }
    &__editButton {
      width: 32px;
      height: 32px;
      font-size: 1.6rem;
      border-radius: 16px;
      &.imagePosition {
        right: -16px;
        bottom: -16px;
      }
      &:hover {
        opacity: 0.6;
      }
    }
    &__userWrap {
      flex: 1;
    }
    &__displayName {
      max-width: calc(100% - 40px);
    }
    &__userDataList {
      display: flex;
      li {
        &:after {
          margin: 0 8px;
          content: '/';
        }
        &:nth-last-child(1):after {
          margin: 0;
          content: none;
        }
      }
    }
    &__prWrap {
      margin-right: 8px;
    }
    &__pr {
      font-size: 1.4rem;
      line-height: 1.4;
    }
    &__subTitle {
      margin: 0 8px 16px;
    }
    &__listParts {
      width: 200px;
      a {
        width: 184px;
        img {
          width: 184px;
        }
      }
    }
    &__listOfficial {
      height: 32px;
      top: -10px;
    }
    &__commissionParts {
      a {
        display: flex;
        &:hover {
          opacity: 0.6;
        }
      }
    }
    &__commissionTitle {
      margin: 0 8px;
      font-size: 1.4rem;
      line-height: 18px;
    }
    &__commissionRightWrap {
      width: 180px;
    }
    &__commissionPrice {
      padding: 8px;
      width: 100px;
      font-size: 1.6rem;
    }
  }
}
.sp {
  .creator {
    width: 100%;
    &__title {
      margin: 0 8px 16px;
    }
    &__wrap {
      margin-bottom: 24px;
      display: block;
    }
    &__imageWrap {
      margin: 0 auto 8px;
    }
    &__userWrap {
      margin: 0 16px;
    }
    &__displayName {
      max-width: calc(100% - 48px);
    }
    &__userDataList {
      li {
        margin-bottom: 4px;
        font-size: 1.4rem;
      }
    }
    &__subTitle {
      margin: 0 8px 16px;
    }
    &__listParts {
      width: calc(100% / 3);
      a {
        width: 100%;
        img {
          width: 100%;
        }
      }
    }
    &__pr {
      font-size: 1.2rem;
      line-height: 1.5;
    }
    &__listOfficial {
      height: 24px;
      top: -8px;
    }
    &__commissionParts {
      a {
        display: block;
        &:active {
          opacity: 0.6;
        }
      }
    }
    &__commissionTitle {
      width: 100%;
      height: 32px;
      margin: 0 8px 8px 0;
      font-size: 1.2rem;
      line-height: 16px;
      display: flex;
      align-items: center;
    }
    &__commissionRightWrap {
      justify-content: flex-end;
    }
    &__commissionType {
      font-size: 1.2rem;
    }
    &__commissionPrice {
      padding: 4px 8px;
      width: 80px;
      font-size: 1.2rem;
    }
  }
}
</style>
