<template>
  <div class="commissions">
    <Loading v-if="processingCommissionComic" page-type="normal" />
    <section class="commissions__list">
      <h1 class="commissions__listTitle">{{ $t('commissionComicList.title') }}</h1>
      <CommissionList
        show-type="commissions"
        commission-type="comic"
        @loading-done="closeProcessing('comic')"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useContext, useMeta } from '@nuxtjs/composition-api'
import { IndexKey } from '@/compositions/key/indexKey'
import { IndexStore } from '@/compositions/index'
import Loading from '@/components/Loading.vue'
import CommissionList from '@/components/CommissionList.vue'

export default defineComponent({
  components: {
    Loading,
    CommissionList,
  },
  setup() {
    /** composition-api **/
    const { app } = useContext()
    const { title, meta } = useMeta()
    /** /composition-api **/

    /** Inject **/
    const { processingCommissionComic, initCommissionProcessing, closeProcessing } = inject(
      IndexKey
    ) as IndexStore
    /** /Inject **/

    /** Created **/
    // コミッション一覧の通信を初期化する関数を呼び出し
    initCommissionProcessing('comic')
    /** /Created **/

    /** Meta **/
    title.value = app.i18n.t('favoriteList.title').toString()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      { hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: 'コミッション一覧（漫画） | Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/commissions-comic' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]
    /** /Meta **/

    return {
      processingCommissionComic,
      closeProcessing,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.commissions {
  &__listTitle {
    color: $font-color-white;
    font-weight: bold;
  }
}
.pc {
  .commissions {
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
  .commissions {
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
