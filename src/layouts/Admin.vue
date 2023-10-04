<template>
  <div class="admin">
    <Loading v-if="guardLoading" page-type="full" />
    <AdminNavi :path="path" />
    <AdminHeader />
    <Nuxt />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  useMeta,
  computed,
  provide,
  inject,
} from '@nuxtjs/composition-api'
import { useDefaultLang } from '@/compositions/lang'
import { ModalKey } from '@/compositions/key/modalKey'
import { useModal } from '@/compositions/modal'
import { BreadcrumbKey } from '@/compositions/key/breadcrumbKey'
import { useBreadcrumb } from '@/compositions/breadcrumb'
import { useRule } from '@/compositions/rule'
import { RuleKey } from '@/compositions/key/ruleKey'
import { GuardKey } from '@/compositions/key/guardKey'
import { GuardStore, useGuard } from '@/compositions/guard'
import { CountKey } from '@/compositions/key/countKey'
import { useCount } from '@/compositions/count'
import { UsersKey } from '@/compositions/key/usersKey'
import { useUsers } from '@/compositions/users'
import { AddAndEditCreatorKey } from '@/compositions/key/addAndEditCreatorKey'
import { useAddAndEditCreator } from '@/compositions/addAndEditCreator'
import { DeleteUserKey } from '@/compositions/key/deleteUserKey'
import { useDeleteUser } from '@/compositions/deleteUser'
import { ListWorksKey } from '@/compositions/key/listWorksKey'
import { useListWorks } from '@/compositions/listWorks'
import { ListCommissionsKey } from '@/compositions/key/listCommissionsKey'
import { useListCommissions } from '@/compositions/listCommissions'
import { ReleaseKey } from '@/compositions/key/releaseKey'
import { useRelease } from '@/compositions/release'
import { ApprovalKey } from '@/compositions/key/approvalKey'
import { useApproval } from '@/compositions/approval'
import { ComicPreviewKey } from '@/compositions/key/comicPreviewKey'
import { useComicPreview } from '@/compositions/comicPreview'
import { AddAndEditWorkKey } from '@/compositions/key/addAndEditWorkKey'
import { useAddAndEditWork } from '@/compositions/addAndEditWork'
import { AddAndEditEpisodeKey } from '@/compositions/key/addAndEditEpisodeKey'
import { useAddAndEditEpisode } from '@/compositions/addAndEditEpisode'
import { ComicDetailKey } from '@/compositions/key/comicDetailKey'
import { useComicDetail } from '@/compositions/comicDetail'
import { CommissionDetailKey } from '@/compositions/key/commissionDetailKey'
import { useCommissionDetail } from '@/compositions/commissionDetail'
import { PostWorksListKey } from '@/compositions/key/postWorksListKey'
import { usePostWorksList } from '@/compositions/postWorksList'
import { PostWorkDetailKey } from '@/compositions/key/postWorkDetailKey'
import { usePostWorkDetail } from '@/compositions/postWorkDetail'
import { PaymentListKey } from '@/compositions/key/paymentListKey'
import { usePaymentList } from '@/compositions/paymentList'
import { ClipboardKey } from '@/compositions/key/clipboardKey'
import { useClipboard } from '@/compositions/clipboard'
import AdminHeader from '@/components/admin/Header.vue'
import AdminNavi from '@/components/admin/Navi.vue'
import { injectGlobalState, provideGlobalState } from '@/utils/states/user'

export default defineComponent({
  components: {
    AdminHeader,
    AdminNavi,
  },
  setup() {
    const { route, app } = useContext()
    const { link, bodyAttrs } = useMeta()

    const path = computed(() => {
      return route.value.path
    })

    provideGlobalState()
    provide(ModalKey, useModal())
    provide(BreadcrumbKey, useBreadcrumb())
    provide(RuleKey, useRule())
    provide(GuardKey, useGuard())
    provide(CountKey, useCount())
    provide(UsersKey, useUsers())
    provide(AddAndEditCreatorKey, useAddAndEditCreator())
    provide(DeleteUserKey, useDeleteUser())
    provide(ListWorksKey, useListWorks())
    provide(ListCommissionsKey, useListCommissions())
    provide(ReleaseKey, useRelease())
    provide(ApprovalKey, useApproval())
    provide(ComicPreviewKey, useComicPreview())
    provide(AddAndEditWorkKey, useAddAndEditWork())
    provide(AddAndEditEpisodeKey, useAddAndEditEpisode())
    provide(ComicDetailKey, useComicDetail())
    provide(CommissionDetailKey, useCommissionDetail())
    provide(PostWorksListKey, usePostWorksList())
    provide(PostWorkDetailKey, usePostWorkDetail())
    provide(PaymentListKey, usePaymentList())
    provide(ClipboardKey, useClipboard())

    const state = injectGlobalState()
    const { guardLoading, roleGuard } = inject(GuardKey) as GuardStore

    state.getUsersSecretData()

    roleGuard()

    bodyAttrs.value = {
      class: app.$device.isDesktop ? 'pc' : 'sp',
      ontouchstart: '',
    }
    useDefaultLang()

    link.value = [
      {
        rel: 'canonical',
        href: `https://pixage.app${path.value}`,
      },
    ]

    return {
      guardLoading,
      path,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.admin {
  color: $font-color-darkgray;
  position: relative;
  background: $background-color-white;
}
.pc {
  .admin {
    padding: 108px 31px 0 176px;
    width: calc(100vw - 15px);
    min-width: 1200px;
    min-height: 100vh;
    &:after {
      width: 15px;
      height: 100vh;
      content: '';
      display: block;
      position: fixed;
      top: 0;
      right: 0;
      background: $background-color-white;
    }
  }
}
.sp {
  .admin {
    width: 100%;
  }
}
</style>
