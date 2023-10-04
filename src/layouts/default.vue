<template>
  <div class="default">
    <Loading v-if="isAccountSignIn && state.uid === ''" page-type="full" />
    <HeaderDesktop v-if="$device.isDesktop" :path="path" />
    <HeaderMobile v-if="!$device.isDesktop" :path="path" />
    <Nuxt />
    <FooterMenuMobile v-if="!$device.isDesktop" v-show="!isOpenMenu" :path="path" />
    <Footer v-if="$device.isDesktop" width="120" height="auto" />
    <Flush v-show="isShowFlush" :type="flushType" :caption="flushCaption" />
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
  onMounted,
  onUnmounted,
} from '@nuxtjs/composition-api'
import { auth } from '@/plugins/firebase'
import { useDefaultLang } from '@/compositions/lang'
import { IndexKey } from '@/compositions/key/indexKey'
import { useIndex } from '@/compositions/index'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore, useAccount } from '@/compositions/account'
import { ModalKey } from '@/compositions/key/modalKey'
import { useModal } from '@/compositions/modal'
import { RuleKey } from '@/compositions/key/ruleKey'
import { useRule } from '@/compositions/rule'
import { GuardKey } from '@/compositions/key/guardKey'
import { useGuard } from '@/compositions/guard'
import { FlushKey } from '@/compositions/key/flushKey'
import { FlushStore, useFlush } from '@/compositions/flush'
import { MenuKey } from '@/compositions/key/menuKey'
import { MenuStore, useMenu } from '@/compositions/menu'
import { ListKey } from '@/compositions/key/listKey'
import { useList } from '@/compositions/list'
import { AddAndEditCreatorKey } from '@/compositions/key/addAndEditCreatorKey'
import { useAddAndEditCreator } from '@/compositions/addAndEditCreator'
import { ComicPreviewKey } from '@/compositions/key/comicPreviewKey'
import { useComicPreview } from '@/compositions/comicPreview'
import { ComicDetailKey } from '@/compositions/key/comicDetailKey'
import { useComicDetail } from '@/compositions/comicDetail'
import { CommissionDetailKey } from '@/compositions/key/commissionDetailKey'
import { useCommissionDetail } from '@/compositions/commissionDetail'
import { EditMyPageKey } from '@/compositions/key/editMyPageKey'
import { useEditMyPage } from '@/compositions/editMyPage'
import { CreatorSpaceKey } from '@/compositions/key/creatorSpaceKey'
import { useCreatorSpace } from '@/compositions/creatorSpace'
import { PrKey } from '@/compositions/key/prKey'
import { usePr } from '@/compositions/pr'
import { PostWorkKey } from '@/compositions/key/postWorkKey'
import { usePostWork } from '@/compositions/postWork'
import { PostCommissionKey } from '@/compositions/key/postCommissionKey'
import { usePostCommission } from '@/compositions/postCommission'
import { EditCommissionKey } from '@/compositions/key/editCommissionKey'
import { useEditCommission } from '@/compositions/editCommission'
import { EditCommissionListKey } from '@/compositions/key/editCommissionListKey'
import { useEditCommissionList } from '@/compositions/editCommissionList'
import { CommissionReleaseKey } from '@/compositions/key/commissionReleaseKey'
import { useCommissionRelease } from '@/compositions/commissionRelease'
import { ReceivableAccountKey } from '@/compositions/key/receivableAccountKey'
import { useReceivableAccount } from '@/compositions/receivableAccount'
import { StripeKey } from '@/compositions/key/stripeKey'
import { useStripe } from '@/compositions/stripe'
import { SalesConfirmWorkKey } from '@/compositions/key/salesConfirmWorkKey'
import { useSalesConfirmWork } from '@/compositions/salesConfirmWork'
import { CreatorPageKey } from '@/compositions/key/creatorPageKey'
import { useCreatorPage } from '@/compositions/creatorPage'
import { InquiryKey } from '@/compositions/key/inquiryKey'
import { useInquiry } from '@/compositions/inquiry'
import HeaderDesktop from '@/components/HeaderDesktop.vue'
import HeaderMobile from '@/components/HeaderMobile.vue'
import FooterMenuMobile from '@/components/footerMenu/FooterMenuMobile.vue'
import Footer from '@/components/Footer.vue'
import Flush from '@/components/Flush.vue'
import Loading from '@/components/Loading.vue'
import { injectGlobalState, provideGlobalState } from '@/utils/states/user'
import { $cookiesOptDelete } from '@/plugins/cookie'

export default defineComponent({
  components: {
    HeaderDesktop,
    HeaderMobile,
    FooterMenuMobile,
    Footer,
    Flush,
    Loading,
  },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const { route, app, redirect } = useContext()
    const { link, bodyAttrs } = useMeta()

    if (app.$cookie.get('notAgreement')) {
      redirect('/agreement_twitter_signin')
    }

    const path = computed(() => {
      return route.value.path
    })

    provideGlobalState()
    provide(IndexKey, useIndex())
    provide(AccountKey, useAccount())
    provide(ModalKey, useModal())
    provide(RuleKey, useRule())
    provide(GuardKey, useGuard())
    provide(FlushKey, useFlush())
    provide(MenuKey, useMenu())
    provide(ListKey, useList())
    provide(AddAndEditCreatorKey, useAddAndEditCreator())
    provide(ComicPreviewKey, useComicPreview())
    provide(ComicDetailKey, useComicDetail())
    provide(CommissionDetailKey, useCommissionDetail())
    provide(EditMyPageKey, useEditMyPage())
    provide(CreatorSpaceKey, useCreatorSpace())
    provide(PrKey, usePr())
    provide(PostWorkKey, usePostWork())
    provide(PostCommissionKey, usePostCommission())
    provide(EditCommissionKey, useEditCommission())
    provide(EditCommissionListKey, useEditCommissionList())
    provide(CommissionReleaseKey, useCommissionRelease())
    provide(ReceivableAccountKey, useReceivableAccount())
    provide(StripeKey, useStripe())
    provide(SalesConfirmWorkKey, useSalesConfirmWork())
    provide(CreatorPageKey, useCreatorPage())
    provide(InquiryKey, useInquiry())

    const state = injectGlobalState()
    const { isAccountSignIn, isVerified } = inject(AccountKey) as AccountStore
    const { isOpenMenu } = inject(MenuKey) as MenuStore
    const { isShowFlush, flushType, flushCaption, flushObject } = inject(FlushKey) as FlushStore

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

    onMounted(() => {
      if (app.$cookie.get('firstSession') && app.$cookie.get('__session')) {
        if (!isVerified()) {
          isShowFlush.value = true
          flushType.value = flushObject.verifyError.type
          flushCaption.value = flushObject.verifyError.caption
        } else {
          isShowFlush.value = true
          flushType.value = flushObject.verifySuccess.type
          flushCaption.value = flushObject.verifySuccess.caption
        }
        app.$cookie.set('firstSession', false, $cookiesOptDelete)
      }
      if (app.$cookie.get('__session')) {
        auth.onAuthStateChanged((user) => {
          if (user) {
            state.getUsersSecretData()
          }
        })
      }
    })

    onUnmounted(() => {
      if (isShowFlush.value) {
        isShowFlush.value = false
        flushType.value = ''
        flushCaption.value = ''
      }
    })

    return {
      state,
      isShowFlush,
      flushType,
      flushCaption,
      path,
      isOpenMenu,
      isAccountSignIn,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.default {
  position: relative;
}
.pc {
  .default {
    padding: 112px 0 180px;
    min-width: 1200px;
    min-height: calc(100vh - 15px);
  }
}
.sp {
  .default {
    padding: 80px 0 calc(68px + env(safe-area-inset-bottom));
    width: 100%;
  }
}
</style>
