<template>
  <div>
    <Breadcrumb :breadcrumbs="adminDetailPostWork(workTitle)" />
    <div class="detailPostWork">
      <dl class="detailPostWork__warning">
        <dt class="detailPostWork__warningTitle">
          <font-awesome-icon :icon="['fas', 'exclamation']" />注意
        </dt>
        <dd class="detailPostWork__warningCaption">
          以下の手順を必ず守ってください。<br />
          ダウンロードをする →
          ファイルを右クリックし、メニューで表示されたセキュリティソフトでzipファイルをでスキャンする
          → 解凍して中身を確認 →
          zipファイルの名前はアップロード時のタイムスタンプになっているので「作品名_話数_エピソードタイトル（なければ省略）.zip」の形にリネームする
          → リネームしたzipファイルをGoogleドライブにアップロードする
        </dd>
        <dd class="detailPostWork__warningCaption">
          新規or既存が既存の場合、作品登録はしないでください。
        </dd>
      </dl>
      <h1 class="detailPostWork__title">投稿作品『{{ workTitle }}』詳細</h1>
      <div class="detailPostWork__workInfo">
        <dl class="detailPostWork__workInfoBlock">
          <dt class="detailPostWork__workInfoBlockTitle">作品名:</dt>
          <dd class="detailPostWork__workInfoBlockContent">{{ workTitle }}</dd>
        </dl>
        <dl class="detailPostWork__workInfoBlock">
          <dt class="detailPostWork__workInfoBlockTitle">作品概要:</dt>
          <dd class="detailPostWork__workInfoBlockContent">{{ workDescription }}</dd>
        </dl>
        <dl class="detailPostWork__workInfoBlock">
          <dt class="detailPostWork__workInfoBlockTitle">ジャンル:</dt>
          <dd class="detailPostWork__workInfoBlockContent">{{ genre }}</dd>
        </dl>
        <dl class="detailPostWork__workInfoBlock">
          <dt class="detailPostWork__workInfoBlockTitle">新規or既存:</dt>
          <dd class="detailPostWork__workInfoBlockContent">{{ isExisting ? '既存' : '新規' }}</dd>
        </dl>
      </div>
      <div class="detailPostWork__info">
        <h2 class="detailPostWork__infoTitle">エピソード情報</h2>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">話数:</dt>
          <dd class="detailPostWork__infoBlockContent">
            {{ episodeNum }}
          </dd>
        </dl>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">エピソードタイトル:</dt>
          <dd :class="['detailPostWork__infoBlockContent', { empty: episodeTitle === '' }]">
            {{ episodeTitle === '' ? '記載なし' : episodeTitle }}
          </dd>
        </dl>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">希望レンタル価格:</dt>
          <dd class="detailPostWork__infoBlockContent">
            {{ episodePrice === 0 ? '' : currency
            }}{{ episodePrice === 0 ? '無料' : episodePrice.toLocaleString() }}
          </dd>
        </dl>
      </div>
      <div class="detailPostWork__info">
        <h2 class="detailPostWork__infoTitle">作者情報</h2>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">表示名:</dt>
          <dd class="detailPostWork__infoBlockContent">
            {{ displayName }}
          </dd>
        </dl>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">メールアドレス:</dt>
          <dd class="detailPostWork__infoBlockContent">
            {{ email }}
          </dd>
        </dl>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">クリエイター区分:</dt>
          <dd
            v-if="isCreator === 'all' && isCreatorForCollaborator === 'notCollaborator'"
            class="detailPostWork__infoBlockContent"
          >
            全作業可
          </dd>
          <dd
            v-if="isCreator === 'all' && isCreatorForCollaborator === 'storyOnly'"
            class="detailPostWork__infoBlockContent"
          >
            全作業可（今回は作画）
          </dd>
          <dd
            v-if="isCreator === 'all' && isCreatorForCollaborator === 'drawingOnly'"
            class="detailPostWork__infoBlockContent"
          >
            全作業可（今回は原作）
          </dd>
          <dd v-if="isCreator === 'storyOnly'" class="detailPostWork__infoBlockContent">
            原作のみ
          </dd>
          <dd v-if="isCreator === 'drawingOnly'" class="detailPostWork__infoBlockContent">
            作画のみ
          </dd>
        </dl>
      </div>
      <div class="detailPostWork__info">
        <h2 class="detailPostWork__infoTitle">共同作業者情報</h2>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">共同作業者の区分:</dt>
          <dd
            v-if="isCreatorForCollaborator === 'notCollaborator'"
            class="detailPostWork__infoBlockContent"
          >
            なし
          </dd>
          <dd
            v-if="isCreatorForCollaborator === 'storyOnly'"
            class="detailPostWork__infoBlockContent"
          >
            原作
          </dd>
          <dd
            v-if="isCreatorForCollaborator === 'drawingOnly'"
            class="detailPostWork__infoBlockContent"
          >
            作画
          </dd>
        </dl>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">共同作業者名:</dt>
          <dd :class="['detailPostWork__infoBlockContent', { empty: collaborator == '' }]">
            {{ collaborator === '' ? 'なし' : collaborator }}
          </dd>
        </dl>
      </div>
      <div class="detailPostWork__info">
        <h2 class="detailPostWork__infoTitle">ファイル情報</h2>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">ファイル名:</dt>
          <dd class="detailPostWork__infoBlockContent">
            {{ fileName }}
          </dd>
        </dl>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">ファイルサイズ:</dt>
          <dd class="detailPostWork__infoBlockContent">
            {{ fileSize }}
          </dd>
        </dl>
      </div>
      <div class="detailPostWork__info">
        <h2 class="detailPostWork__infoTitle">補足</h2>
        <p class="detailPostWork__infoMemo">{{ memo }}</p>
      </div>
      <div class="detailPostWork__info">
        <h2 class="detailPostWork__infoTitle">操作履歴</h2>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">ダウンロード:</dt>
          <dd v-if="downloadLogs.length" class="detailPostWork__infoBlockContent">
            <dl
              v-for="(downloadLog, index) in downloadLogs"
              :key="index"
              class="detailPostWork__infoList"
            >
              <dt class="detailPostWork__infoListName">{{ downloadLog.adminEmail }}</dt>
              <dd class="detailPostWork__infoListContent">
                {{ convertTimestampForDate(downloadLog.createdAt) }}
              </dd>
            </dl>
          </dd>
          <dd v-if="!downloadLogs.length" class="detailPostWork__infoBlockContent">
            未ダウンロード
          </dd>
        </dl>
        <dl class="detailPostWork__infoBlock">
          <dt class="detailPostWork__infoBlockTitle">削除:</dt>
          <dd v-if="deleteLogs.length" class="detailPostWork__infoBlockContent">
            <dl
              v-for="(deleteLog, index) in deleteLogs"
              :key="index"
              class="detailPostWork__infoList"
            >
              <dt class="detailPostWork__infoListName">{{ deleteLog.adminEmail }}</dt>
              <dt class="detailPostWork__infoListContent">
                {{ convertTimestampForDate(deleteLog.createdAt) }}
              </dt>
            </dl>
          </dd>
          <dd v-if="!deleteLogs.length" class="detailPostWork__infoBlockContent">未削除</dd>
        </dl>
      </div>
      <div v-if="!deleteLogs.length">
        <div class="detailPostWork__buttonWrapper">
          <a
            :href="fileUlr"
            class="detailPostWork__button"
            target="_blank"
            @click="updateDownloadLog(id)"
            ><font-awesome-icon :icon="['fas', 'download']" />ダウンロード</a
          >
          <button
            class="detailPostWork__button delete"
            :disabled="!downloadLogs.length"
            @click="updateDeleteLog(id)"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />削除
          </button>
        </div>
        <p class="detailPostWork__buttonCaption">
          ※ 一度でもダウンロードしていないと削除できません。
        </p>
      </div>
      <div v-if="deleteLogs.length">
        <p class="detailPostWork__buttonCaption">削除済み</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, useMeta, useRoute } from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { PostWorkDetailKey } from '@/compositions/key/postWorkDetailKey'
import { PostWorkDetailStore } from '@/compositions/postWorkDetail'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'
import { convertTimestampForDate } from '@/utils/util'

export default defineComponent({
  components: {
    Breadcrumb,
  },
  layout: 'Admin',
  setup() {
    /** composition-api **/
    const { title, titleTemplate, meta } = useMeta()
    const route = useRoute()
    /** /composition-api **/

    /** Inject **/
    const { adminDetailPostWork } = inject(BreadcrumbKey) as BreadcrumbStore
    const {
      displayName,
      email,
      isCreator,
      isCreatorForCollaborator,
      collaborator,
      isExisting,
      workTitle,
      workDescription,
      genre,
      episodeNum,
      episodeTitle,
      episodePrice,
      currency,
      memo,
      fileName,
      fileSize,
      fileUlr,
      downloadLogs,
      deleteLogs,
      initDetailPostWork,
      updateDownloadLog,
      updateDeleteLog,
    } = inject(PostWorkDetailKey) as PostWorkDetailStore
    /** /Inject **/

    /** Computed **/
    const id = computed(() => route.value.params.id)
    /** /Computed **/

    /** Created **/
    // 作品詳細の初期化関数の呼び出し
    initDetailPostWork(id.value)
    /** /Created **/

    /** Meta **/
    title.value = '投稿作品詳細'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      convertTimestampForDate,
      adminDetailPostWork,
      displayName,
      email,
      isCreator,
      isCreatorForCollaborator,
      collaborator,
      isExisting,
      workTitle,
      workDescription,
      genre,
      episodeNum,
      episodeTitle,
      episodePrice,
      currency,
      memo,
      fileName,
      fileSize,
      fileUlr,
      downloadLogs,
      deleteLogs,
      updateDownloadLog,
      updateDeleteLog,
      id,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.detailPostWork {
  padding-bottom: 32px;
  &__warning {
    margin-bottom: 16px;
    padding: 16px;
    border: $border-color-red solid 2px;
  }
  &__warningTitle {
    font-size: 1.6rem;
    color: $font-color-red;
    font-weight: bold;
    > svg {
      margin-right: 4px;
    }
  }
  &__warningCaption {
    margin-top: 8px;
    color: $font-color-red;
    line-height: 1.6;
  }
  &__title {
    margin-bottom: 16px;
    font-size: 2rem;
    line-height: 2;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__workInfo {
    margin-bottom: 32px;
  }
  &__workInfoBlock {
    margin-bottom: 16px;
    width: 100%;
    display: flex;
  }
  &__workInfoBlockTitle {
    width: 100px;
  }
  &__workInfoBlockContent {
    flex: 1;
  }
  &__info {
    padding: 8px;
    margin-bottom: 16px;
    &:nth-of-type(even) {
      background: $background-color-whiteLead;
    }
  }
  &__infoTitle {
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__infoBlock {
    margin: 8px 8px 0;
    width: calc(100% - 16px);
    display: flex;
  }
  &__infoBlockTitle {
    width: 160px;
  }
  &__infoBlockContent {
    flex: 1;
    &.empty {
      opacity: 0.4;
    }
  }
  &__infoMemo {
    margin: 8px 8px 0;
    width: calc(100% - 16px);
    white-space: pre-wrap;
  }
  &__infoList {
    width: 100%;
    display: flex;
  }
  &__infoListName {
    width: 300px;
    font-weight: normal;
  }
  &__infoListContent {
    font-weight: normal;
    flex: 1;
  }
  &__buttonWrapper {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
  }
  &__button {
    margin: 0 16px 8px;
    padding: 0 16px;
    width: 200px;
    height: 40px;
    font-size: 1.3rem;
    color: $font-color-darkgray;
    line-height: 38px;
    text-align: center;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &.delete {
      color: $font-color-white;
      border: $button-color-danger-on-border solid 1px;
      background: $button-color-danger-on-bg;
    }
    > svg {
      margin-right: 4px;
    }
    &:hover,
    &:disabled {
      opacity: 0.6;
    }
  }
  &__buttonCaption {
    color: $font-color-red;
    text-align: center;
  }
}
</style>
