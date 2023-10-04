<template>
  <div>
    <Breadcrumb :breadcrumbs="adminAddWork()" />
    <div class="addWork">
      <h1 class="addWork__title">作品登録</h1>
      <form @submit.prevent="clickAddWork">
        <Thumbnail page-type="add" @add-file="addFile($event)" />

        <WorkTitle
          :value="workTitle"
          :params="params.workTitle"
          :is-dirty="isDirty.workTitle"
          page-type="add"
          @input="workTitle = $event"
          @is-clean="resetValidation('workTitle')"
        />

        <WorkDescription
          :value="workDescription"
          :params="params.workDescription"
          :is-dirty="isDirty.workDescription"
          page-type="add"
          @input="workDescription = $event"
          @is-clean="resetValidation('workDescription')"
        />

        <Creator
          :is-dirty="isDirty.creator"
          :error="creatorError"
          :radio="radioCreator"
          :creator-all-id="creatorAllId"
          :creator-story-id="creatorStoryId"
          :creator-drawing-id="creatorDrawingId"
          page-type="add"
          @is-clean="isDirty.creator = false"
          @send-creator-id="getCreator($event)"
          @delete-error="creatorError = ''"
          @change-radio="radioCreator = $event"
        />

        <Genre
          :value="genre"
          :params="params.genre"
          :is-dirty="isDirty.genre"
          page-type="add"
          @input="genre = $event"
          @is-clean="resetValidation('genre')"
        />

        <Official :value="official" page-type="add" @input="official = $event" />

        <div class="addWork__inputButtonArea">
          <button class="addWork__inputButton">登録して作品一覧へ</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useMeta } from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { AddAndEditWorkKey } from '@/compositions/key/addAndEditWorkKey'
import { AddAndEditWorkStore } from '@/compositions/addAndEditWork'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'
import Thumbnail from '@/components/addAndEditWork/Thumbnail.vue'
import WorkTitle from '@/components/addAndEditWork/WorkTitle.vue'
import WorkDescription from '@/components/addAndEditWork/WorkDescription.vue'
import Creator from '@/components/addAndEditWork/Creator.vue'
import Genre from '@/components/addAndEditWork/Genre.vue'
import Official from '@/components/addAndEditWork/Official.vue'

export default defineComponent({
  components: {
    Breadcrumb,
    Thumbnail,
    WorkTitle,
    WorkDescription,
    Creator,
    Genre,
    Official,
  },
  layout: 'Admin',
  setup() {
    /** composition-api **/
    const { title, titleTemplate, meta } = useMeta()
    /** /composition-api **/

    /** Inject **/
    const { adminAddWork } = inject(BreadcrumbKey) as BreadcrumbStore
    const {
      workTitle,
      workDescription,
      creatorAllId,
      creatorStoryId,
      creatorDrawingId,
      creatorError,
      radioCreator,
      genre,
      official,
      isDirty,
      params,
      initVariables,
      addFile,
      getCreator,
      clickAddWork,
      resetValidation,
    } = inject(AddAndEditWorkKey) as AddAndEditWorkStore
    /** /Inject **/

    /** Created **/
    // 値初期化の呼び出し
    initVariables()
    /** /Created **/

    /** Meta **/
    title.value = '作品登録'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminAddWork,
      isDirty,
      workTitle,
      workDescription,
      creatorAllId,
      creatorStoryId,
      creatorDrawingId,
      creatorError,
      radioCreator,
      genre,
      official,
      params,
      addFile,
      getCreator,
      clickAddWork,
      resetValidation,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.addWork {
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
