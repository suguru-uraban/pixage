<template>
  <div class="top">
    <Loading
      v-if="
        processingCommissionComic ||
        processingCommissionCosplay ||
        processingCommissionAnime ||
        processingCommissionIllust ||
        processingWorkList
      "
      page-type="normal"
    />
    <div class="top__background" />
    <section class="top__list">
      <h1 class="top__listTitle">{{ $t('section.commissionListTitle') }}</h1>
      <ul class="top__tab">
        <li
          :class="['top__tabParts', { current: currentTab === 'comic' }]"
          @click="changeTab('comic')"
        >
          {{ $t('section.commissionComicTitle') }}
        </li>
        <li
          :class="['top__tabParts', { current: currentTab === 'illust' }]"
          @click="changeTab('illust')"
        >
          {{ $t('section.commissionIllustTitle') }}
        </li>
        <li
          :class="['top__tabParts', { current: currentTab === 'cosplay' }]"
          @click="changeTab('cosplay')"
        >
          {{ $t('section.commissionCosplayTitle') }}
        </li>
        <li
          :class="['top__tabParts', { current: currentTab === 'anime' }]"
          @click="changeTab('anime')"
        >
          {{ $t('section.commissionAnimeTitle') }}
        </li>
      </ul>
      <div v-show="currentTab === 'comic'" class="top__commissionSection">
        <CommissionList
          show-type="indexCommissions"
          commission-type="comic"
          @loading-done="closeProcessing('comic')"
        />
      </div>
      <div v-show="currentTab === 'illust'" class="top__commissionSection">
        <CommissionList
          show-type="indexCommissions"
          commission-type="illust"
          @loading-done="closeProcessing('illust')"
        />
      </div>
      <div v-show="currentTab === 'cosplay'" class="top__commissionSection">
        <CommissionList
          show-type="indexCommissions"
          commission-type="cosplay"
          @loading-done="closeProcessing('cosplay')"
        />
      </div>
      <div v-show="currentTab === 'anime'" class="top__commissionSection">
        <CommissionList
          show-type="indexCommissions"
          commission-type="anime"
          @loading-done="closeProcessing('anime')"
        />
      </div>
    </section>
    <section class="top__list">
      <h1 class="top__listTitle">{{ $t('section.workListTitle') }}</h1>
      <WorkList show-type="indexComics" @loading-done="closeProcessing('work')" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useMeta } from '@nuxtjs/composition-api'
import { IndexKey } from '@/compositions/key/indexKey'
import { IndexStore } from '@/compositions/index'
import Loading from '@/components/Loading.vue'
import CommissionList from '@/components/CommissionList.vue'
import WorkList from '@/components/WorkList.vue'

export default defineComponent({
  components: {
    Loading,
    CommissionList,
    WorkList,
  },
  setup() {
    /** composition-api **/
    const { titleTemplate, meta } = useMeta()
    /** /composition-api **/

    /** Inject **/
    const {
      processingCommissionComic,
      processingCommissionCosplay,
      processingCommissionAnime,
      processingCommissionIllust,
      processingWorkList,
      currentTab,
      initIndexProcessing,
      closeProcessing,
      changeTab,
    } = inject(IndexKey) as IndexStore
    /** /Inject **/

    /** Created **/
    // トップ画面の通信を初期化する関数を呼び出し
    initIndexProcessing()
    /** /Created **/

    /** Meta **/
    titleTemplate.value = ''
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content:
          '誰でもクリエイターになれる漫画投稿サイト「Pixage」。漫画家の卵や埋もれた才能が発掘されるチャンス。人気作品は読者からの支援やリクエスト、アニメ化される可能性もあり！',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:title', property: 'og:title', content: 'Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          '誰でもクリエイターになれる漫画投稿サイト「Pixage」。漫画家の卵や埋もれた才能が発掘されるチャンス。人気作品は読者からの支援やリクエスト、アニメ化される可能性もあり！',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]
    /** /Meta **/

    return {
      processingCommissionComic,
      processingCommissionCosplay,
      processingCommissionAnime,
      processingCommissionIllust,
      processingWorkList,
      currentTab,
      closeProcessing,
      changeTab,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.top {
  &__list {
    position: relative;
  }
  &__listTitle {
    color: $font-color-white;
    font-weight: bold;
  }
  &__tab {
    margin: 0 8px 8px;
    display: flex;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__tabParts {
    height: 40px;
    line-height: 39px;
    text-align: center;
    background: $background-color-darkgray-opacity;
    border-top: $border-color-darkgray solid 1px;
    border-left: $border-color-darkgray solid 1px;
    &.current {
      color: $font-color-black;
      line-height: 40px;
      font-weight: bold;
      border: none;
      background: $background-color-gray;
    }
    &:nth-of-type(1) {
      border-radius: 4px 0 0 0;
    }
    &:nth-last-of-type(1) {
      border-radius: 0 4px 0 0;
      border-right: $border-color-darkgray solid 1px;
    }
  }
}
.pc {
  .top {
    min-height: 400px;
    &__background {
      margin: auto;
      width: 1060px;
      height: 594px;
      position: fixed;
      left: 0;
      right: -500px;
      bottom: -32px;
      background: url('@/assets/images/bg_top_pc.jpg') no-repeat;
      opacity: 0.2;
      &:after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        box-shadow: inset 0 0 45px 90px $background-color-default;
      }
    }
    &__list {
      margin: 0 auto 16px;
      padding: 0 8px 32px;
      width: 100%;
      max-width: 1200px;
    }
    &__commissionSection {
      padding: 0 4px 24px;
    }
    &__listTitle {
      margin: 0 8px 16px;
      font-size: 2.4rem;
    }
    &__tabParts {
      width: 88px;
      font-size: 1.4rem;
      cursor: pointer;
      &.current {
        font-size: 1.6rem;
        cursor: default;
      }
    }
  }
}
.sp {
  .top {
    &__background {
      margin: auto;
      width: 100%;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      opacity: 0.4;
      z-index: -1;
      &:after {
        content: '';
        width: 100%;
        height: 100vh;
        display: block;
        position: sticky;
        top: 0;
        background: url('@/assets/images/bg_top_sp.jpg') no-repeat center top;
      }
    }
    &__list {
      padding: 0 8px 16px;
      width: 100%;
    }
    &__commissionSection {
      padding-bottom: 16px;
    }
    &__listTitle {
      margin: 0 8px 16px;
      font-size: 1.4rem;
    }
    &__tabParts {
      width: 25%;
      font-size: 1.2rem;
      &.current {
        font-size: 1.4rem;
      }
    }
  }
}
</style>
