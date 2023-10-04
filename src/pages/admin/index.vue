<template>
  <div>
    <Breadcrumb :breadcrumbs="adminTop()" />
    <div class="adminIndex">
      <h2 class="adminIndex__title">現在のPixageのデータ</h2>
      <div class="adminIndex__countArea">
        <dl class="adminIndex__countBlock">
          <dt class="adminIndex__countBlockTitle">総ユーザー数</dt>
          <dd class="adminIndex__countBlockContent">{{ usersCount }}</dd>
        </dl>
        <dl class="adminIndex__countBlock">
          <dt class="adminIndex__countBlockTitle">総クリエイター数</dt>
          <dd class="adminIndex__countBlockContent">{{ creatorsCount }}</dd>
        </dl>
        <dl class="adminIndex__countBlock">
          <dt class="adminIndex__countBlockTitle">総作品数</dt>
          <dd class="adminIndex__countBlockContent">{{ worksCount }}</dd>
        </dl>
        <dl class="adminIndex__countBlock">
          <dt class="adminIndex__countBlockTitle">総コミッション数</dt>
          <dd class="adminIndex__countBlockContent">{{ commissionsCount }}</dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useMeta } from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { CountKey } from '@/compositions/key/countKey'
import { CountStore } from '@/compositions/count'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'

export default defineComponent({
  components: {
    Breadcrumb,
  },
  layout: 'Admin',
  setup() {
    /** composition-api **/
    const { titleTemplate, meta } = useMeta()
    /** /composition-api **/

    /** Inject **/
    const { adminTop } = inject(BreadcrumbKey) as BreadcrumbStore
    const {
      usersCount,
      creatorsCount,
      worksCount,
      commissionsCount,
      getUsersCount,
      getCreatorsCount,
      getWorksCount,
      getCommissionsCount,
    } = inject(CountKey) as CountStore
    /** /Inject **/

    /** Created **/
    // 総ユーザー数を取得する関数の呼び出し
    getUsersCount()

    // 総クリエイター数を取得する関数の呼び出し
    getCreatorsCount()

    // 総作品数を取得する関数の呼び出し
    getWorksCount()

    // 総コミッション数を取得する関数の呼び出し
    getCommissionsCount()
    /** /Created **/

    /** Meta **/
    titleTemplate.value = 'Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminTop,
      usersCount,
      creatorsCount,
      worksCount,
      commissionsCount,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.adminIndex {
  &__title {
    margin-bottom: 16px;
    font-size: 2rem;
    line-height: 2;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__countArea {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  &__countBlock {
    padding: 16px;
    width: calc(25% - 16px);
    border-radius: 4px;
    border: $border-color-lightgray solid 3px;
  }
  &__countBlockTitle {
    margin-bottom: 24px;
    font-size: 2rem;
    color: $font-color-lightgray;
    text-align: center;
  }
  &__countBlockContent {
    text-align: center;
    font-size: 2rem;
  }
}
</style>
