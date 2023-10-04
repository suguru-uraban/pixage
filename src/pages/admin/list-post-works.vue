<template>
  <div>
    <Breadcrumb :breadcrumbs="adminListPostWorks()" />
    <div class="listPostWorks">
      <h1 class="listPostWorks__title">投稿作品一覧</h1>
      <p v-if="!postWorks.length" class="listPostWorks__caption">作品はありません。</p>
      <div v-if="postWorks.length">
        <ul class="listPostWorks__header">
          <li class="listPostWorks__headerTitle" data-style="workTitle">作品名</li>
          <li class="listPostWorks__headerTitle" data-style="episodeNum">話数</li>
          <li class="listPostWorks__headerTitle" data-style="episodeTitle">エピソードタイトル</li>
          <li class="listPostWorks__headerTitle" data-style="displayName">作者</li>
          <li class="listPostWorks__headerTitle" data-style="downloadCheck">DL済</li>
          <li class="listPostWorks__headerTitle" data-style="deleteCheck">削除済</li>
        </ul>
        <ul class="listPostWorks__list">
          <li v-for="postWork in postWorks" :key="postWork.uid" class="listPostWorks__listBlock">
            <nuxt-link :to="`/admin/detail-post-work/${postWork.uid}`">
              <div class="listPostWorks__listWorkTitle">{{ postWork.workTitle }}</div>
              <div class="listPostWorks__listEpisodeNum">{{ postWork.episodeNum }}</div>
              <div class="listPostWorks__listEpisodeTitle">{{ postWork.episodeTitle }}</div>
              <div class="listPostWorks__listDisplayName">{{ postWork.displayName }}</div>
              <div class="listPostWorks__listDownloadCheck">
                <span v-if="postWork.downloadCheck" class="listPostWorks__checkDone">済</span>
                <span v-if="!postWork.downloadCheck" class="listPostWorks__checkNotYet">未</span>
              </div>
              <div class="listPostWorks__listDeleteCheck">
                <span v-if="postWork.deleteCheck" class="listPostWorks__checkDone">済</span>
                <span v-if="!postWork.deleteCheck" class="listPostWorks__checkNotYet">未</span>
              </div>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useMeta } from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { PostWorksListKey } from '@/compositions/key/postWorksListKey'
import { PostWorksListStore } from '@/compositions/postWorksList'
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
    const { adminListPostWorks } = inject(BreadcrumbKey) as BreadcrumbStore
    const { postWorks, initPostWorks } = inject(PostWorksListKey) as PostWorksListStore
    /** /Inject **/

    /** Created **/
    // 値初期化の呼び出し
    initPostWorks()
    /** /Created **/

    /** Meta **/
    title.value = '投稿作品一覧'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminListPostWorks,
      postWorks,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.listPostWorks {
  &__title {
    margin-bottom: 16px;
    font-size: 2rem;
    line-height: 2;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__caption {
    margin: 0 12px;
  }
  &__header {
    margin: 0 12px;
    width: calc(100% - 24px);
    min-width: 800px;
    display: flex;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__headerTitle {
    padding: 8px 0;
    font-size: 1.2rem;
    font-weight: bold;
    &[data-style='workTitle'] {
      flex: 1;
    }
    &[data-style='episodeNum'] {
      width: 160px;
    }
    &[data-style='episodeTitle'] {
      width: 240px;
    }
    &[data-style='displayName'] {
      width: 240px;
    }
    &[data-style='downloadCheck'] {
      width: 60px;
      text-align: center;
    }
    &[data-style='deleteCheck'] {
      width: 60px;
      text-align: center;
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
    border-bottom: $border-color-lightgray dotted 1px;
    > a {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  &__listWorkTitle {
    padding: 8px 0;
    flex: 1;
  }
  &__listEpisodeNum {
    padding: 8px 0;
    width: 160px;
  }
  &__listEpisodeTitle {
    padding: 8px 0;
    width: 240px;
  }
  &__listDisplayName {
    padding: 8px 0;
    width: 240px;
  }
  &__listDownloadCheck {
    padding: 8px 0;
    width: 60px;
    text-align: center;
  }
  &__listDeleteCheck {
    padding: 8px 0;
    width: 60px;
    text-align: center;
  }
  &__checkDone {
    width: 40px;
    height: 20px;
    font-size: 1.3rem;
    color: $font-color-green;
    line-height: 20px;
    font-weight: bold;
    text-align: center;
    display: inline-block;
    border-radius: 20px;
    background: $background-color-opalGreen;
  }
  &__checkNotYet {
    width: 40px;
    height: 20px;
    font-size: 1.3rem;
    color: $font-color-orange;
    line-height: 20px;
    font-weight: bold;
    text-align: center;
    display: inline-block;
    border-radius: 20px;
    background: $background-color-sunshineYellow;
  }
}
</style>
