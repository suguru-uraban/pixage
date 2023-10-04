<template>
  <div>
    <Breadcrumb :breadcrumbs="adminListWorks()" />
    <div class="listWorks">
      <h1 class="listWorks__title">作品一覧</h1>
      <p v-if="!works.length" class="listWorks__caption">作品はありません。</p>
      <ul class="listWorks__list">
        <li
          v-for="work in works"
          :key="work.workId"
          :class="['listWorks__listBlock', { release: work.release }]"
        >
          <div class="listWorks__listName">
            <img
              v-if="work.official"
              :src="require('@/assets/images/logo_official.svg')"
              alt="Pixage公式"
              class="listWorks__official"
            />
            <img
              :src="
                work.ja.thumbnail
                  ? work.ja.thumbnail
                  : require('@/assets/images/thumbnail_noImage.jpg')
              "
              :alt="work.ja.workTitle"
              class="listWorks__thumbnail"
            />
          </div>
          <dl>
            <dt class="listWorks__workTitle">
              {{ work.ja.workTitle }}
            </dt>
          </dl>
          <div class="listWorks__buttonArea">
            <nuxt-link :to="`/admin/detail-work/${work.workId}`" class="listWorks__button">
              <font-awesome-icon :icon="['fas', 'book-open']" />作品詳細
            </nuxt-link>
            <nuxt-link :to="`/admin/edit-work/${work.workId}`" class="listWorks__button">
              <font-awesome-icon :icon="['fas', 'edit']" />作品編集
            </nuxt-link>
            <nuxt-link :to="`/admin/add-episode/${work.workId}`" class="listWorks__button">
              <font-awesome-icon :icon="['fas', 'upload']" />各話アップロード
            </nuxt-link>
            <button
              class="listWorks__button"
              @click="openModalWithWorkId(work.workId, work.ja.workTitle)"
            >
              <font-awesome-icon :icon="['fas', !work.release ? 'lock-open' : 'lock']" />{{
                !work.release ? '公開する' : '非公開にする'
              }}
            </button>
          </div>
        </li>
      </ul>
    </div>

    <WorkReleaseModal
      :current-work-id="currentWorkId"
      :current-work-title="currentWorkTitle"
      @switch-release="switchRelease"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useMeta } from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { ListWorksKey } from '@/compositions/key/listWorksKey'
import { ListWorksStore } from '@/compositions/listWorks'
import Breadcrumb from '@/components/admin/Breadcrumb.vue'
import WorkReleaseModal from '@/components/modals/release/WorkReleaseModal.vue'

export default defineComponent({
  components: {
    Breadcrumb,
    WorkReleaseModal,
  },
  layout: 'Admin',
  setup() {
    /** composition-api **/
    const { title, titleTemplate, meta } = useMeta()
    /** /composition-api **/

    /** Inject **/
    const { adminListWorks } = inject(BreadcrumbKey) as BreadcrumbStore
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    const { works, currentWorkId, currentWorkTitle, initListWorks } = inject(
      ListWorksKey
    ) as ListWorksStore
    /** /Inject **/

    /** Created **/
    // 作品リストを初期化関数の呼び出し
    initListWorks()
    /** /Created **/

    /** Function **/
    // 公開・非公開のモーダル表示
    const openModalWithWorkId = (workId: number, workTitle: string) => {
      currentWorkId.value = workId
      currentWorkTitle.value = workTitle
      handleOpenModal('workRelease')
    }

    // 公開・非公開の切り替え
    const switchRelease = () => {
      works.value = []
      initListWorks()
    }
    /** /Function **/

    /** Meta **/
    title.value = '作品一覧'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminListWorks,
      works,
      currentWorkId,
      currentWorkTitle,
      openModalWithWorkId,
      switchRelease,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.listWorks {
  &__title {
    margin-bottom: 16px;
    font-size: 2rem;
    line-height: 2;
    font-weight: bold;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__caption {
    margin: 0 12px;
  }
  &__list {
    margin: 0 12px;
    width: calc(100% - 24px);
    min-width: 800px;
    display: flex;
    flex-wrap: wrap;
  }
  &__listBlock {
    margin: 0 16px 16px 0;
    padding: 8px;
    width: 216px;
    position: relative;
    border-radius: 8px;
    background: $background-color-whiteLead;
    &.release {
      background: $background-color-iceGreen;
    }
  }
  &__official {
    width: auto;
    height: 32px;
    position: absolute;
    top: -4px;
    left: -4px;
    z-index: 1;
  }
  &__thumbnail {
    margin: 0 auto 16px;
    width: auto;
    height: 180px;
    display: block;
  }
  &__workTitle {
    margin-bottom: 16px;
    height: 68px;
    font-size: 1.4rem;
    word-break: break-all;
  }
  &__buttonArea {
    margin: auto;
  }
  &__button {
    margin-bottom: 8px;
    padding: 0 16px;
    width: 200px;
    height: 40px;
    font-size: 1.3rem;
    color: $font-color-darkgray;
    line-height: 38px;
    text-align: center;
    display: block;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    > svg {
      margin-right: 4px;
    }
    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
