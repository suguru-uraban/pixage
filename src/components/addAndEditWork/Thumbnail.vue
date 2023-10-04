<template>
  <div class="thumbnail">
    <h2 class="thumbnail__subTitle">
      サムネイルをドラッグ＆ドロップ or クリックしてファイルを選択
    </h2>
    <ul class="thumbnail__attentionList">
      <li class="thumbnail__attentionListParts">サムネイルは1枚のみ登録してください。</li>
      <li class="thumbnail__attentionListParts">画像ファイルはjpgを利用してください。</li>
      <li class="thumbnail__attentionListParts">1枚のファイルサイズは500KB以下にしてください。</li>
    </ul>
    <div class="thumbnail__imageWrap">
      <div class="thumbnail__uploadWrap">
        <client-only>
          <UploadImages ref="myVueUploadDropImagesRef" @changed="handleImage($event, ctx)" />
        </client-only>
      </div>
      <dl v-if="pageType === 'edit'" class="thumbnail__preview">
        <dt class="thumbnail__previewTitle">現在のサムネイル</dt>
        <dd class="thumbnail__previewImage">
          <img
            :src="prevThumbnail ? prevThumbnail : require('@/assets/images/thumbnail_noImage.jpg')"
            alt=""
          />
        </dd>
      </dl>
    </div>
    <div class="thumbnail__error">{{ errorMessageAddThumbnail }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, useRoute } from '@nuxtjs/composition-api'
import { AddAndEditWorkKey } from '@/compositions/key/addAndEditWorkKey'
import { AddAndEditWorkStore } from '@/compositions/addAndEditWork'

export default defineComponent({
  props: {
    pageType: {
      type: String,
      required: true,
    },
  },
  emits: ['input'],
  setup(props, ctx) {
    /** composition-api **/
    const route = useRoute()
    /** /composition-api **/

    /** Inject **/
    const {
      prevThumbnail,
      errorMessageAddThumbnail,
      myVueUploadDropImagesRef,
      initThumbnail,
      handleImage,
    } = inject(AddAndEditWorkKey) as AddAndEditWorkStore
    /** /Inject **/

    /** Computed **/
    const id = computed(() => route.value.params.id)
    /** /Computed **/

    /** Created **/
    // すでにサムネイルがある場合の初期化呼び出し
    initThumbnail(props.pageType, id.value)
    /** /Created **/

    return {
      ctx,
      prevThumbnail,
      errorMessageAddThumbnail,
      myVueUploadDropImagesRef,
      handleImage,
    }
  },
})
</script>

<style lang="scss" scoped>
.thumbnail {
  margin-bottom: 16px;
  padding: 0 8px;
  &__subTitle {
    margin-bottom: 8px;
    font-size: 1.6rem;
    line-height: 2;
    font-weight: bold;
  }
  &__attentionList {
    padding-left: 1.2rem;
    text-indent: -1rem;
  }
  &__attentionListParts {
    margin-bottom: 8px;
    padding-left: 1.2rem;
    font-size: 1.2rem;
    line-height: 1.4;
    display: flex;
    &:before {
      content: '※';
      text-indent: -2rem;
    }
  }
  &__imageWrap {
    display: flex;
  }
  &__uploadWrap {
    width: 400px;
  }
  &__preview {
    margin-left: 16px;
  }
  &__previewTitle {
    margin-bottom: 8px;
  }
  &__previewImage {
    img {
      width: auto;
      height: 200px;
    }
  }
  &__error {
    height: 14px;
    margin: 8px 0 16px;
    color: $font-color-red;
    font-size: 1.2rem;
    font-weight: bold;
  }
}
</style>
