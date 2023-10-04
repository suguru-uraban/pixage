<template>
  <div>
    <Breadcrumb :breadcrumbs="adminDetailWork(workTitle)" />
    <div class="detailWork">
      <h1 class="detailWork__title">『{{ workTitle }}』詳細</h1>

      <div class="detailWork__upper">
        <img
          :src="thumbnail ? thumbnail : require('@/assets/images/thumbnail_noImage.jpg')"
          :alt="workTitle"
          class="detailWork__image"
        />
        <div class="detailWork__upperRight">
          <p v-if="official" class="detailWork__upperRightOfficial">
            <img
              :src="require('@/assets/images/logo_official.svg')"
              alt="Pixage公式"
              class="listWorks__official"
            />Pixage公式作品
          </p>

          <dl class="detailWork__upperRightBlock">
            <dt class="detailWork__upperRightBlockTitle">タイトル</dt>
            <dd class="detailWork__upperRightBlockContent">{{ workTitle }}</dd>
          </dl>

          <dl class="detailWork__upperRightBlock">
            <dt class="detailWork__upperRightBlockTitle">著者</dt>
            <dd v-if="creator.all !== ''" class="detailWork__upperRightBlockContent">
              <p class="detailWork__upperRightBlockCreator">{{ creator.all }}</p>
            </dd>
            <dd v-if="creator.all === ''" class="detailWork__upperRightBlockContent">
              <p class="detailWork__upperRightBlockCreator">原作：{{ creator.story }}</p>
              <p class="detailWork__upperRightBlockCreator">作画：{{ creator.drawing }}</p>
            </dd>
          </dl>

          <dl class="detailWork__upperRightBlock">
            <dt class="detailWork__upperRightBlockTitle">ジャンル</dt>
            <dd class="detailWork__upperRightBlockContent">{{ genre }}</dd>
          </dl>

          <dl class="detailWork__upperRightBlock">
            <dt class="detailWork__upperRightBlockTitle">総いいね数</dt>
            <dd class="detailWork__upperRightBlockContent">{{ totalLike }}</dd>
          </dl>

          <dl class="detailWork__upperRightBlock">
            <dt class="detailWork__upperRightBlockTitle">お気に入り登録数</dt>
            <dd class="detailWork__upperRightBlockContent">{{ favorite }}</dd>
          </dl>

          <dl class="detailWork__upperRightDescription">
            <dt class="detailWork__upperRightDescriptionTitle">作品概要</dt>
            <dd class="detailWork__upperRightDescriptionContent">{{ workDescription }}</dd>
          </dl>
        </div>
      </div>

      <div class="detailWork__lower">
        <h2 class="detailWork__lowerTitle">アップロード済み話数</h2>
        <p class="detailWork__lowerAttention">
          ※ Stripeに紐づけるためにはmetadataの入力が必要です。Stripeの商品画面で入力してください。
        </p>
        <p class="detailWork__lowerAttention">
          ※ 必要なデータは、「lang」と「workAndEpisodeId」の2つです。
        </p>
        <p class="detailWork__lowerAttention">
          ※ 「lang」は『<span>{{ lang }}</span
          >』を入力してください。
        </p>
        <p class="detailWork__lowerAttention">
          ※ 「workAndEpisodeId」は下の話数リストにある「1-2」、「3-10」といった数値を入力します。<br />
          横のボタンを押すとクリップボードにコピーできます。
        </p>

        <ul class="detailWork__episodes">
          <li
            v-for="episode in episodes"
            :key="episode.episodeId"
            :class="['detailWork__episode', { release: episode.release }]"
          >
            <dl class="detailWork__episodeLeft">
              <dt class="detailWork__episodeNum">{{ episode.episodeNum }}</dt>
              <dd class="detailWork__episodeContent">{{ episode.episodeTitle }}</dd>
              <dd class="detailWork__episodeContent">いいね数：{{ episode.like }}</dd>
            </dl>
            <div class="detailWork__episodeRight">
              <div class="detailWork__metadata">
                <div
                  v-if="copyText !== '' && currentEpisodeClipboard === episode.episodeId"
                  class="detailWork__copyText"
                >
                  {{ copyText }}
                </div>
                <input type="text" readonly :value="`${id}-${episode.episodeId}`" />
                <button
                  v-clipboard:copy="`${id}-${episode.episodeId}`"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                  type="button"
                  @click="getCurrentEpisode(episode.episodeId)"
                >
                  <font-awesome-icon :icon="['fas', 'clipboard']" />
                </button>
              </div>
              <div class="detailWork__price">
                {{
                  episode.episodePrice === 0 ? '無料' : `￥${episode.episodePrice.toLocaleString()}`
                }}
              </div>
              <button class="detailWork__inputButton" @click="episodePreview(episode.episodeId)">
                <font-awesome-icon :icon="['fas', 'book-open']" /><span>プレビュー</span>
              </button>
              <nuxt-link
                :to="`/admin/edit-episode/${id}/${episode.episodeId}`"
                class="detailWork__inputButton"
              >
                <font-awesome-icon :icon="['fas', 'edit']" />編集
              </nuxt-link>
              <button
                class="detailWork__inputButton"
                @click="openModalWithEpisodeId(episode.episodeId)"
              >
                <font-awesome-icon :icon="['fas', !episode.release ? 'lock-open' : 'lock']" />{{
                  !episode.release ? '公開' : '非公開'
                }}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <ComicPreview
      v-if="isPreview"
      :images="previewImages"
      user-type="admin"
      :work-id="Number(id)"
      :episode-id="episodeId"
      @preview-close="episodePreviewClose"
    />
    <EpisodeReleaseModal
      :work-uid="workUid"
      :current-episode-id="currentEpisodeId"
      @switch-release="switchRelease"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  useMeta,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { ComicDetailKey } from '@/compositions/key/comicDetailKey'
import { ComicDetailStore } from '@/compositions/comicDetail'
import { ClipboardKey } from '@/compositions/key/clipboardKey'
import { ClipboardStore } from '@/compositions/clipboard'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'
import EpisodeReleaseModal from '@/components/modals/release/EpisodeReleaseModal.vue'

export default defineComponent({
  components: {
    Breadcrumb,
    EpisodeReleaseModal,
  },
  layout: 'Admin',
  setup() {
    /** composition-api **/
    const { title, titleTemplate, meta } = useMeta()
    const route = useRoute()
    /** /composition-api **/

    /** Inject **/
    const { adminDetailWork } = inject(BreadcrumbKey) as BreadcrumbStore
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    const {
      workUid,
      thumbnail,
      workTitle,
      workDescription,
      creator,
      genre,
      totalLike,
      favorite,
      official,
      lang,
      episodes,
      previewImages,
      episodeId,
      isPreview,
      currentEpisodeId,
      initComicDetailVariables,
      initComicDetail,
      episodePreview,
      episodePreviewClose,
      switchRelease,
    } = inject(ComicDetailKey) as ComicDetailStore
    const { copyText, currentEpisodeClipboard, onCopy, onError } = inject(
      ClipboardKey
    ) as ClipboardStore
    /** /Inject **/

    /** Computed **/
    const id = computed(() => route.value.params.id)
    /** /Computed **/

    /** Created **/
    // 値を初期化する関数の呼び出し
    initComicDetailVariables()

    // 作品詳細の初期化関数の呼び出し
    initComicDetail(id.value)
    /** /Created **/

    /** Watch **/
    // episodesを監視して変更があったら新しいepisodesを返す
    watch(episodes, () => {
      return episodes
    })
    /** /Watch **/

    /** Function **/
    // 公開・非公開のモーダルを開く
    const openModalWithEpisodeId = (episodeId: number) => {
      currentEpisodeId.value = episodeId
      handleOpenModal('episodeRelease')
    }

    // クリップボードに格納するエピソードIDを取得
    const getCurrentEpisode = (episodeId: number) => {
      currentEpisodeClipboard.value = episodeId
    }
    /** /Function **/

    /** Meta **/
    title.value = '作品詳細'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminDetailWork,
      workUid,
      thumbnail,
      workTitle,
      workDescription,
      creator,
      genre,
      totalLike,
      favorite,
      official,
      lang,
      episodes,
      previewImages,
      episodeId,
      isPreview,
      currentEpisodeId,
      episodePreview,
      episodePreviewClose,
      switchRelease,
      copyText,
      currentEpisodeClipboard,
      onCopy,
      onError,
      id,
      openModalWithEpisodeId,
      getCurrentEpisode,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.detailWork {
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
  &__image {
    margin-right: 16px;
    width: auto;
    height: 400px;
  }
  &__upperRight {
    padding-top: 16px;
    flex: 1;
  }
  &__upperRightBlock {
    margin-bottom: 16px;
    display: flex;
  }
  &__upperRightBlockTitle {
    width: 144px;
    font-size: 1.4rem;
    font-weight: normal;
  }
  &__upperRightBlockContent {
    font-size: 1.8rem;
    font-weight: bold;
  }
  &__upperRightOfficial {
    margin-bottom: 16px;
    font-size: 1.6rem;
    font-weight: bold;
    img {
      margin-right: 4px;
      width: auto;
      height: 24px;
    }
  }
  &__upperRightDescription {
    margin-bottom: 16px;
  }
  &__upperRightDescriptionTitle {
    margin-bottom: 8px;
    font-size: 1.4rem;
    font-weight: normal;
  }
  &__upperRightDescriptionContent {
    font-size: 1.6rem;
    font-weight: normal;
  }
  &__upperRightBlockCreator {
    margin-bottom: 8px;
    font-size: 1.8rem;
    font-weight: bold;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
  &__inputButtonArea {
    padding: 12px 0 24px;
    text-align: center;
    position: relative;
  }
  &__inputButton {
    padding: 0 8px;
    width: 80px;
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
  &__episodes {
    width: 1000px;
    border-top: $border-color-lightgray solid 1px;
  }
  &__episode {
    padding: 0 16px;
    height: 90px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: $border-color-lightgray solid 1px;
    &.release {
      background: $background-color-iceGreen;
    }
  }
  &__episodeLeft {
    margin-right: 8px;
    flex: 1;
  }
  &__episodeNum {
    margin-bottom: 4px;
  }
  &__episodeContent {
    margin-bottom: 8px;
    height: 34px;
    &:nth-last-child(1) {
      margin-bottom: 0;
      height: auto;
    }
  }
  &__episodeRight {
    width: 500px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__metadata {
    width: 138px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    > input[type='text'] {
      padding: 8px;
      width: 98px;
      height: 40px;
      border-radius: 4px 0 0 4px;
      border-top: $border-color-lightgray solid 1px;
      border-left: $border-color-lightgray solid 1px;
      border-bottom: $border-color-lightgray solid 1px;
      background: $background-color-white;
    }
    > button {
      width: 40px;
      height: 40px;
      text-align: center;
      border-radius: 0 4px 4px 0;
      border: $button-color-normal-border solid 1px;
      background: $button-color-normal-bg;
      &:hover {
        opacity: 0.6;
      }
    }
  }
  &__copyText {
    margin: auto;
    padding: 4px 8px;
    color: $font-color-white;
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: 42px;
    white-space: nowrap;
    border-radius: 4px;
    background: $background-color-dark;
  }
  &__price {
    width: 96px;
    height: 30px;
    font-size: 1.6rem;
    color: $font-color-gray;
    font-weight: bold;
    text-align: center;
    line-height: 28px;
    border-radius: 4px;
    border: $border-color-lightgray solid 1px;
    background: $background-color-whiteLead;
  }
}
</style>
