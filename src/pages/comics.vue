<template>
  <div class="comics">
    <Loading v-if="processingWorkList" page-type="normal" />
    <section class="comics__list">
      <h1 class="comics__listTitle">{{ $t('comicList.title') }}</h1>
      <WorkList show-type="comics" @loading-done="closeProcessing('work')" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useContext, useMeta } from '@nuxtjs/composition-api'
import { IndexKey } from '@/compositions/key/indexKey'
import { IndexStore } from '@/compositions/index'
import Loading from '@/components/Loading.vue'
import WorkList from '@/components/WorkList.vue'

export default defineComponent({
  components: {
    Loading,
    WorkList,
  },
  setup() {
    /** composition-api **/
    const { app } = useContext()
    const { title, meta } = useMeta()
    /** /composition-api **/

    /** Inject **/
    const { processingWorkList, initWorksProcessing, closeProcessing } = inject(
      IndexKey
    ) as IndexStore
    /** /Inject **/

    /** Created **/
    // 作品一覧の通信を初期化する関数を呼び出し
    initWorksProcessing()
    /** /Created **/

    /** Meta **/
    title.value = app.i18n.t('favoriteList.title').toString()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: '作品一覧 | Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/comics' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]
    /** /Meta **/

    return {
      processingWorkList,
      closeProcessing,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.comics {
  &__listTitle {
    color: $font-color-white;
    font-weight: bold;
  }
}
.pc {
  .comics {
    min-height: 400px;
    &__list {
      margin: 0 auto 16px;
      padding: 0 8px 32px;
      width: 100%;
      max-width: 1200px;
    }
    &__listTitle {
      margin: 0 8px 16px;
      font-size: 2.4rem;
    }
  }
}
.sp {
  .comics {
    &__list {
      padding: 0 8px 16px;
      width: 100%;
    }
    &__listTitle {
      margin: 0 8px 16px;
      font-size: 1.4rem;
    }
  }
}
</style>
