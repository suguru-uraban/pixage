<template>
  <div class="comicDetail">
    <Loading v-if="processingData || processingEpisode" page-type="normal" />
    <ComicData
      ref="dataRef"
      :work-id="Number(workId)"
      @loading-done="closeProcessingData"
      @get-title="title = $event"
      @get-meta="
        meta = [
          {
            hid: 'description',
            name: 'description',
            content: $event.workDescription,
          },
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'og:title', property: 'og:title', content: `${title} | Pixage` },
          {
            hid: 'og:description',
            property: 'og:description',
            content: $event.workDescription,
          },
          {
            hid: 'og:url',
            property: 'og:url',
            content: `https://pixage.app/comic-detail/${workId}`,
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: '/icon.png',
          },
          {
            hid: 'twitter:card',
            property: 'twitter:card',
            content: 'summary',
          },
          {
            hid: 'twitter:site',
            property: 'twitter:site',
            content: '@pixage_inc',
          },
          {
            hid: 'twitter:domain',
            property: 'twitter:domain',
            content: 'pixage.app',
          },
          {
            hid: 'twitter:title',
            property: 'twitter:title',
            content: `${title} | Pixage`,
          },
          {
            hid: 'twitter:description',
            property: 'twitter:description',
            content: $event.workDescription,
          },
          {
            hid: 'twitter:image',
            property: 'twitter:image',
            content: $event.thumbnail,
          },
        ]
      "
    />
    <ComicEpisodes
      ref="episodeRef"
      :work-id="Number(workId)"
      @loading-done="closeProcessingEpisode"
      @reload="reload"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, useContext, useMeta } from '@nuxtjs/composition-api'
import { ComicDetailKey } from '@/compositions/key/comicDetailKey'
import { ComicDetailStore } from '@/compositions/comicDetail'
import ComicData from '@/components/comicDetail/ComicData.vue'
import ComicEpisodes from '@/components/comicDetail/ComicEpisodes.vue'

export default defineComponent({
  components: {
    ComicData,
    ComicEpisodes,
  },
  setup(_, ctx) {
    /** composition-api **/
    const { title, meta } = useMeta()
    const { route } = useContext()
    /** /composition-api **/

    /** Inject **/
    const {
      processingData,
      processingEpisode,
      dataRef,
      episodeRef,
      closeProcessingData,
      closeProcessingEpisode,
    } = inject(ComicDetailKey) as ComicDetailStore
    /** /Inject **/

    /** Computed **/
    const workId = computed(() => route.value.params.id)
    /** /Computed **/

    /** Created **/
    processingData.value = true
    processingEpisode.value = true
    /** /Created **/

    /** Function **/
    // ユーザー画面上部と下部を両方再読み込み
    const reload = () => {
      dataRef.value.initComicData(ctx, Number(workId.value))
      episodeRef.value.initComicEpisodes(ctx, Number(workId.value))
    }
    /** /Function **/

    return {
      title,
      meta,
      workId,
      processingData,
      processingEpisode,
      dataRef,
      episodeRef,
      closeProcessingData,
      closeProcessingEpisode,
      reload,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.comicDetail {
  margin: auto;
}
.pc {
  .comicDetail {
    width: 800px;
  }
}
.sp {
  .comicDetail {
    width: 100%;
  }
}
</style>
