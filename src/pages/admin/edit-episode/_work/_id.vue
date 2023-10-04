<template>
  <div>
    <Breadcrumb :breadcrumbs="adminEditEpisode(workTitle, workId, episodeNum)" />
    <div class="editEpisode">
      <h1 class="editEpisode__title">『{{ workTitle }}{{ episodeNum }}』編集</h1>
      <form @submit.prevent="clickEditEpisode(workId, episodeId)">
        <Images
          page-type="edit"
          :image-files-error-message="imageFilesErrorMessage"
          @add-file="addFile($event)"
          @validate="handleImageValidate"
          @handle-image-null="handleImageNull"
        />

        <EpisodeNum
          :value="episodeNum"
          :params="params.episodeNum"
          :is-dirty="isDirty.episodeNum"
          page-type="edit"
          @input="episodeNum = $event"
          @is-clean="resetValidation('episodeNum')"
        />

        <EpisodeTitle
          :value="episodeTitle"
          :params="params.episodeTitle"
          :is-dirty="isDirty.episodeTitle"
          page-type="edit"
          @input="episodeTitle = $event"
          @is-clean="resetValidation('episodeTitle')"
        />

        <EpisodePrice
          :value="String(episodePrice)"
          :params="params.episodePrice"
          :is-dirty="isDirty.episodePrice"
          page-type="edit"
          @input="episodePrice = $event"
          @is-clean="resetValidation('episodePrice')"
        />
        <div class="editEpisode__inputButtonArea">
          <button class="editEpisode__inputButton">登録して作品詳細へ</button>
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
    const { adminEditEpisode } = inject(BreadcrumbKey) as BreadcrumbStore
    const {
      workTitle,
      imageFilesErrorMessage,
      episodeNum,
      episodeTitle,
      episodePrice,
      isDirty,
      params,
      getEpisode,
      initVariables,
      addFile,
      handleImageValidate,
      handleImageNull,
      clickEditEpisode,
      resetValidation,
    } = inject(AddAndEditEpisodeKey) as AddAndEditEpisodeStore
    /** /Inject **/

    /** Computed **/
    const workId = computed(() => route.value.params.work)
    const episodeId = computed(() => route.value.params.id)
    /** /Computed **/

    /** Created **/
    // 値初期化の呼び出し
    initVariables()

    // 編集する話数を取得する関数の呼び出し
    getEpisode(workId.value, episodeId.value)
    /** /Created **/

    /** Meta **/
    title.value = '各話編集'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminEditEpisode,
      workTitle,
      imageFilesErrorMessage,
      episodeNum,
      episodeTitle,
      episodePrice,
      isDirty,
      params,
      addFile,
      handleImageValidate,
      handleImageNull,
      clickEditEpisode,
      resetValidation,
      workId,
      episodeId,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.editEpisode {
  &__title {
    margin-bottom: 16px;
    font-size: 2rem;
    line-height: 2;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
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
