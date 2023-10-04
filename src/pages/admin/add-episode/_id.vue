<template>
  <div>
    <Breadcrumb :breadcrumbs="adminAddEpisode()" />
    <div class="addEpisode">
      <h1 class="addEpisode__title">各話アップロード</h1>
      <div class="addEpisode__workData">
        <img
          :src="thumbnail ? thumbnail : require('@/assets/images/thumbnail_noImage.jpg')"
          :alt="workTitle"
        />
        <dl class="addEpisode__workDataRight">
          <dt class="addEpisode__workDataRightTitle">{{ workTitle }}</dt>
          <dd class="addEpisode__workDataRightCaption">
            現在、{{ episodeCount }}本の話がアップロードされています。
          </dd>
        </dl>
      </div>
      <form @submit.prevent="clickAddEpisode(id)">
        <Images
          page-type="add"
          :image-files-error-message="imageFilesErrorMessage"
          @add-file="addFile($event)"
          @validate="handleImageValidate"
          @handle-image-null="handleImageNull"
        />

        <EpisodeNum
          :value="episodeNum"
          :params="params.episodeNum"
          :is-dirty="isDirty.episodeNum"
          page-type="add"
          @input="episodeNum = $event"
          @is-clean="resetValidation('episodeNum')"
        />

        <EpisodeTitle
          :value="episodeTitle"
          :params="params.episodeTitle"
          :is-dirty="isDirty.episodeTitle"
          page-type="add"
          @input="episodeTitle = $event"
          @is-clean="resetValidation('episodeTitle')"
        />

        <EpisodePrice
          :value="String(episodePrice)"
          :params="params.episodePrice"
          :is-dirty="isDirty.episodePrice"
          page-type="add"
          @input="episodePrice = $event"
          @is-clean="resetValidation('episodePrice')"
        />
        <div class="addEpisode__inputButtonArea">
          <button class="addEpisode__inputButton">登録して作品詳細へ</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, useMeta, useRoute } from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { AddAndEditEpisodeKey } from '@/compositions/key/addAndEditEpisodeKey'
import { AddAndEditEpisodeStore } from '@/compositions/addAndEditEpisode'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'
import Images from '@/components/addAndEditEpisode/Images.vue'
import EpisodeNum from '@/components/addAndEditEpisode/EpisodeNum.vue'
import EpisodeTitle from '@/components/addAndEditEpisode/EpisodeTitle.vue'
import EpisodePrice from '@/components/addAndEditEpisode/EpisodePrice.vue'

export default defineComponent({
  components: {
    Breadcrumb,
    Images,
    EpisodeNum,
    EpisodeTitle,
    EpisodePrice,
  },
  layout: 'Admin',
  setup() {
    /** composition-api **/
    const { title, titleTemplate, meta } = useMeta()
    const route = useRoute()
    /** /composition-api **/

    /** Inject **/
    const { adminAddEpisode } = inject(BreadcrumbKey) as BreadcrumbStore
    const {
      thumbnail,
      workTitle,
      episodeCount,
      imageFilesErrorMessage,
      episodeNum,
      episodeTitle,
      episodePrice,
      isDirty,
      params,
      getWork,
      initVariables,
      addFile,
      handleImageValidate,
      handleImageNull,
      clickAddEpisode,
      resetValidation,
    } = inject(AddAndEditEpisodeKey) as AddAndEditEpisodeStore
    /** /Inject **/

    /** Computed **/
    const id = computed(() => route.value.params.id)
    /** /Computed **/

    /** Created **/
    // 値初期化の呼び出し
    initVariables()

    // 話数を追加する作品を取得する関数の呼び出し
    getWork(id.value)
    /** /Created **/

    /** Meta **/
    title.value = '各話アップロード'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminAddEpisode,
      thumbnail,
      workTitle,
      episodeCount,
      imageFilesErrorMessage,
      episodeNum,
      episodeTitle,
      episodePrice,
      isDirty,
      params,
      addFile,
      handleImageValidate,
      handleImageNull,
      clickAddEpisode,
      resetValidation,
      id,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.addEpisode {
  &__title {
    margin-bottom: 16px;
    font-size: 2rem;
    line-height: 2;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__workData {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    img {
      width: auto;
      height: 180px;
    }
  }
  &__workDataRight {
    margin-left: 16px;
  }
  &__workDataRightTitle {
    margin-bottom: 8px;
    font-size: 1.8rem;
  }
  &__workDataRightCaption {
    font-size: 1.6rem;
  }
  &__inputButtonArea {
    padding: 12px 0 24px;
    text-align: center;
    position: relative;
  }
  &__inputButton {
    padding: 0 16px;
    height: 40px;
    color: $font-color-darkgray;
    line-height: 38px;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
