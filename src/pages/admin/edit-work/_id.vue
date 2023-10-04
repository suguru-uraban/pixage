<template>
  <div>
    <Breadcrumb :breadcrumbs="adminEditWork()" />
    <div class="editWork">
      <h1 class="editWork__title">作品編集</h1>
      <form @submit.prevent="clickEditWork">
        <Thumbnail page-type="edit" @add-file="addFile($event)" />

        <WorkTitle
          :value="workTitle"
          :params="params.workTitle"
          :is-dirty="isDirty.workTitle"
          page-type="edit"
          @input="workTitle = $event"
          @is-clean="resetValidation('workTitle')"
        />

        <WorkDescription
          :value="workDescription"
          :params="params.workDescription"
          :is-dirty="isDirty.workDescription"
          page-type="edit"
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
          page-type="edit"
          @is-clean="isDirty.creator = false"
          @send-creator-id="getCreator($event)"
          @delete-error="creatorError = ''"
          @change-radio="radioCreator = $event"
        />

        <Genre
          :value="genre"
          :params="params.genre"
          :is-dirty="isDirty.genre"
          page-type="edit"
          @input="genre = $event"
          @is-clean="resetValidation('genre')"
        />

        <Official :value="official" page-type="edit" @input="official = $event" />

        <div class="editWork__inputButtonArea">
          <button class="editWork__inputButton">登録して作品一覧へ</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, useMeta, useRoute } from '@nuxtjs/composition-api'
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
    const route = useRoute()
    /** /composition-api **/

    /** Inject **/
    const { adminEditWork } = inject(BreadcrumbKey) as BreadcrumbStore
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
      initEditWork,
      clickEditWork,
      resetValidation,
    } = inject(AddAndEditWorkKey) as AddAndEditWorkStore
    /** /Inject **/

    /** Computed **/
    const id = computed(() => route.value.params.id)
    /** /Computed **/

    /** Created **/
    // 値初期化の呼び出し
    initVariables()

    // 作品編集の初期化呼び出し
    initEditWork(id.value)
    /** /Created **/

    /** Meta **/
    title.value = '作品編集'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminEditWork,
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
      addFile,
      getCreator,
      clickEditWork,
      resetValidation,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.editWork {
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
