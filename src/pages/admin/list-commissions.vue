<template>
  <div>
    <Breadcrumb :breadcrumbs="adminListCommissions()" />
    <div class="listCommissions">
      <h1 class="listCommissions__title">コミッション一覧</h1>
      <p v-if="!commissions.length" class="listCommissions__caption">コミッションはありません。</p>
      <div v-if="commissions.length">
        <ul class="listCommissions__header">
          <li class="listCommissions__headerTitle" data-style="picture" />
          <li class="listCommissions__headerTitle" data-style="title">タイトル</li>
          <li class="listCommissions__headerTitle" data-style="type">種類</li>
          <li class="listCommissions__headerTitle" data-style="displayName">表示名</li>
          <li class="listCommissions__headerTitle" data-style="status">承認</li>
          <li class="listCommissions__headerTitle" data-style="status">公開</li>
        </ul>
        <ul class="listCommissions__list">
          <li
            v-for="commission in commissions"
            :key="commission.commissionId"
            class="listCommissions__listBlock"
          >
            <nuxt-link :to="`/admin/detail-commission/${commission.commissionId}`">
              <div class="listCommissions__listPicture">
                <img
                  :src="
                    commission.picture
                      ? commission.picture.replace('_normal', '')
                      : require('@/assets/images/icon_default_picture.svg')
                  "
                  alt=""
                />
              </div>
              <div class="listCommissions__listTitle">{{ commission.ja.commissionTitle }}</div>
              <div class="listCommissions__listType">
                {{ commission.commissionType === 'comic' ? '漫画' : '' }}
                {{ commission.commissionType === 'illust' ? 'イラスト' : '' }}
                {{ commission.commissionType === 'cosplay' ? 'コスプレ' : '' }}
                {{ commission.commissionType === 'anime' ? 'アニメ' : '' }}
              </div>
              <div class="listCommissions__listDisplayName">{{ commission.displayName }}</div>
              <div class="listCommissions__listStatus">
                <span v-if="commission.approval" class="listCommissions__checkDone">済</span>
                <span v-if="!commission.approval" class="listCommissions__checkNotYet">未</span>
              </div>
              <div class="listCommissions__listStatus">
                <span v-if="commission.release" class="listCommissions__checkDone">済</span>
                <span v-if="!commission.release" class="listCommissions__checkNotYet">未</span>
              </div>
            </nuxt-link>
          </li>
        </ul>

        <WorkReleaseModal
          :current-work-id="currentWCommissionId"
          :current-work-title="currentCommissionTitle"
          @switch-release="switchRelease"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useMeta } from '@nuxtjs/composition-api'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { BreadcrumbStore } from '@/compositions/breadcrumb'
import { ModalKey } from '@/compositions/key/modalKey'
import { ModalStore } from '@/compositions/modal'
import { ListCommissionsKey } from '@/compositions/key/listCommissionsKey'
import { ListCommissionsStore } from '@/compositions/listCommissions'
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
    const { adminListCommissions } = inject(BreadcrumbKey) as BreadcrumbStore
    const { handleOpenModal } = inject(ModalKey) as ModalStore
    const { commissions, currentWCommissionId, currentCommissionTitle, initListCommissions } =
      inject(ListCommissionsKey) as ListCommissionsStore
    /** /Inject **/

    /** Created **/
    // 作品リストを初期化関数の呼び出し
    initListCommissions()
    /** /Created **/

    /** Function **/
    // 公開・非公開のモーダル表示
    const openModalWithWorkId = (workId: number, workTitle: string) => {
      currentWCommissionId.value = workId
      currentCommissionTitle.value = workTitle
      handleOpenModal('workRelease')
    }

    // 公開・非公開の切り替え
    const switchRelease = () => {
      commissions.value = []
      initListCommissions()
    }
    /** Function **/

    /** Meta **/
    title.value = '作品一覧'
    titleTemplate.value = '%s | Pixage管理画面'
    meta.value = [{ hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' }]
    /** /Meta **/

    return {
      adminListCommissions,
      commissions,
      currentWCommissionId,
      currentCommissionTitle,
      openModalWithWorkId,
      switchRelease,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.listCommissions {
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
  &__header {
    margin: 0 12px;
    width: calc(100% - 24px);
    min-width: 800px;
    display: flex;
    border-bottom: $border-color-lightgray solid 1px;
  }
  &__headerTitle {
    padding: 8px 0;
    font-size: 1.2rem;
    font-weight: bold;
    &[data-style='picture'] {
      width: 60px;
    }
    &[data-style='title'] {
      flex: 1;
    }
    &[data-style='type'] {
      width: 80px;
    }
    &[data-style='displayName'] {
      width: 160px;
    }
    &[data-style='status'] {
      width: 56px;
      text-align: center;
    }
  }
  &__list {
    margin: 0 12px;
    width: calc(100% - 24px);
    min-width: 800px;
  }
  &__listBlock {
    width: 100%;
    min-height: 33px;
    border-bottom: $border-color-lightgray dotted 1px;
    > a {
      width: 100%;
      height: 100%;
      line-height: 1.4;
      display: flex;
      align-items: center;
      &:hover {
        opacity: 0.6;
      }
    }
  }
  &__listPicture {
    padding: 8px 0;
    width: 60px;
    > img {
      width: 40px;
      height: 40px;
    }
  }
  &__listTitle {
    margin: 8px 8px 8px 0;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  &__listType {
    padding: 8px 0;
    width: 80px;
  }
  &__listDisplayName {
    padding: 8px 8px 8px 0;
    width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__listStatus {
    padding: 8px 0;
    width: 56px;
    text-align: center;
  }
  &__checkDone {
    width: 40px;
    height: 20px;
    font-size: 1.3rem;
    color: $font-color-green;
    line-height: 20px;
    font-weight: bold;
    text-align: center;
    display: inline-block;
    border-radius: 20px;
    background: $background-color-opalGreen;
  }
  &__checkNotYet {
    width: 40px;
    height: 20px;
    font-size: 1.3rem;
    color: $font-color-orange;
    line-height: 20px;
    font-weight: bold;
    text-align: center;
    display: inline-block;
    border-radius: 20px;
    background: $background-color-sunshineYellow;
  }
}
</style>
