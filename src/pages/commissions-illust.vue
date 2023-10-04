<template>
  <div class="commissions">
    <Loading v-if="processingCommissionIllust" page-type="normal" />
    <section class="commissions__list">
      <h1 class="commissions__listTitle">{{ $t('commissionIllustList.title') }}</h1>
      <CommissionList
        show-type="commissions"
        commission-type="illust"
        @loading-done="closeProcessing('illust')"
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
    const { processingCommissionIllust, initCommissionProcessing, closeProcessing } = inject(
      IndexKey
    ) as IndexStore
    /** /Inject **/

    /** Created **/
    // コミッション一覧の通信を初期化する関数を呼び出し
    initCommissionProcessing('illust')
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
      { hid: 'og:title', property: 'og:title', content: 'コミッション一覧（イラスト） | Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/commissions-illust' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]
    /** /Meta **/

    return {
      processingCommissionIllust,
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
