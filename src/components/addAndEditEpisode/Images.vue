<template>
  <div class="images">
    <h2 class="images__subTitle">
      原稿をドラッグ＆ドロップ or クリックしてファイルを選択<span v-if="pageType === 'add'"
        >※必須</span
      >
    </h2>
    <ul class="images__attentionList">
      <li class="images__attentionListParts">画像ファイルはjpgを利用してください。</li>
      <li class="images__attentionListParts">1枚のファイルサイズは500KB以下にしてください。</li>
      <li class="images__attentionListParts">画像は50枚までアップロードできます。</li>
      <li class="images__attentionListParts">
        原稿のアップロード後は、必ず詳細画面でプレビューを確認してください。
      </li>
      <li v-if="pageType === 'edit'" class="images__attentionListParts">
        システム上、一部分のみの変更はできません。原稿を変更したい場合は全てのページをアップロードしてください。古いファイルは破棄されます。
      </li>
    </ul>
    <div class="images__imageWrap">
      <div class="images__uploadWrap">
        <client-only>
          <UploadImages ref="myVueUploadDropImagesRef" @changed="handleImage($event, ctx)" />
        </client-only>
      </div>
    </div>
    <div class="images__error">{{ errorMessageAddImages }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, toRefs, watch } from '@nuxtjs/composition-api'
import { AddAndEditEpisodeKey } from '@/compositions/key/addAndEditEpisodeKey'
import { AddAndEditEpisodeStore } from '@/compositions/addAndEditEpisode'

export default defineComponent({
  props: {
    imageFilesErrorMessage: {
      type: String,
      required: true,
    },
    pageType: {
      type: String,
      required: true,
    },
  },
  emits: ['input'],
  setup(props, ctx) {
    /** Inject **/
    const { errorMessageAddImages, myVueUploadDropImagesRef, handleImage } = inject(
      AddAndEditEpisodeKey
    ) as AddAndEditEpisodeStore
    /** /Inject **/

    /** Watch **/
    // propsで受け取ったimageFilesErrorMessageの変化を検知するためリアクティブ化する
    const { imageFilesErrorMessage } = toRefs(props)

    // imageFilesErrorMessageを監視して、変化があればerrorMessageAddImagesに格納
    watch(imageFilesErrorMessage, () => {
      errorMessageAddImages.value = imageFilesErrorMessage.value
    })
    /** /Watch **/

    return {
      ctx,
      errorMessageAddImages,
      myVueUploadDropImagesRef,
      handleImage,
    }
  },
})
</script>

<style lang="scss" scoped>
.images {
  margin-bottom: 16px;
  padding: 0 8px;
  &__subTitle {
    margin-bottom: 8px;
    font-size: 1.6rem;
    line-height: 2;
    font-weight: bold;
    span {
      margin-left: 4px;
      font-size: 1.2rem;
      color: $font-color-red;
    }
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
    width: 100%;
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
