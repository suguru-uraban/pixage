<template>
  <dl v-if="!$device.isDesktop || isOpenAccountMenu" class="accountInner">
    <dt class="accountInner__listName">
      <font-awesome-icon :icon="['fas', 'meh']" />{{ state.displayName.value }}
    </dt>
    <dd class="accountInner__listParts" @click="handleOpenMenu">
      <nuxt-link to="/mypage" class="accountInner__link"
        ><font-awesome-icon :icon="['fas', 'address-card']" />{{
          $t('headerAccount.myPage')
        }}</nuxt-link
      >
    </dd>
    <dd class="accountInner__listParts">
      <span class="accountInner__link" @click="clickSignOut"
        ><font-awesome-icon :icon="['fas', 'sign-out-alt']" />{{
          $t('headerAccount.signOut')
        }}</span
      >
    </dd>
  </dl>
</template>

<script lang="ts">
import { defineComponent, inject, useContext, useRouter } from '@nuxtjs/composition-api'
import { auth } from '@/plugins/firebase'
import { $cookiesOptDelete } from '@/plugins/cookie'
import { MenuKey } from '@/compositions/key/menuKey'
import { MenuStore } from '@/compositions/menu'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import { FlushKey } from '@/compositions/key/flushKey'
import { FlushStore } from '@/compositions/flush'
import { injectGlobalState } from '@/utils/states/user'

export default defineComponent({
  setup() {
    /** composition-api **/
    const { app } = useContext()
    const router = useRouter()
    /** /composition-api **/

    /** Inject **/
    const state = injectGlobalState()
    const { handleOpenMenu } = inject(MenuKey) as MenuStore
    const { isOpenAccountMenu, handleOpenAccountMenu } = inject(AccountKey) as AccountStore
    const { isShowFlush, flushType, flushCaption, flushObject } = inject(FlushKey) as FlushStore
    /** /Inject **/

    /** Function **/
    // ログアウト
    const signOut = async () => {
      await auth.signOut()
      app.$cookie.set('__session', '', $cookiesOptDelete)
      state.cleanUserData()
      router.push('/signout')
    }

    // クリックしてログアウトした後の動作
    const clickSignOut = () => {
      signOut()
        .then(() => {
          isOpenAccountMenu.value = false
        })
        .catch(() => {
          isOpenAccountMenu.value = false
          isShowFlush.value = true
          flushType.value = flushObject.signOutError.type
          flushCaption.value = flushObject.signOutError.caption
        })
    }

    return {
      state,
      handleOpenMenu,
      isOpenAccountMenu,
      handleOpenAccountMenu,
      clickSignOut,
    }
  },
})
</script>

<style lang="scss" scoped>
.accountInner {
  &__listName {
    height: auto;
    font-size: 1.8rem;
    line-height: 2.4rem;
    font-weight: bold;
    white-space: nowrap;
    svg {
      margin-right: 4px;
    }
  }
  &__listParts {
    font-size: 1.6rem;
    color: $font-color-lightgray;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
    svg {
      margin-right: 4px;
    }
  }
}
.pc {
  .accountInner {
    padding: 16px;
    min-width: 200px;
    text-align: left;
    position: absolute;
    top: 64px;
    right: 0;
    border-radius: 4px 0 4px 4px;
    box-shadow: 2px 4px 4px $shadow-color;
    background: $background-color-gray-opacity;
    &__listName {
      margin-bottom: 8px;
    }
    &__listParts {
      margin: 0 0 4px 8px;
      height: auto;
      line-height: 2.4rem;
      > a,
      span {
        text-decoration: underline;
        cursor: pointer;
        &:hover {
          color: $font-color-white;
          text-decoration: none;
        }
      }
    }
  }
}
.sp {
  .accountInner {
    &__listName {
      padding: 12px 0 8px 16px;
      color: $font-color-darkgray;
      border-radius: 0 5px 0 0;
      background: $background-color-gray;
    }
    &__listParts {
      height: 40px;
      line-height: 40px;
      border-bottom: $border-color-lightgray dotted 1px;
      &:nth-last-of-type(1) {
        border-bottom: none;
        .accountInner__link {
          border-radius: 0 0 6px 6px;
        }
      }
    }
    &__link {
      padding-left: 24px;
      width: 100%;
      height: 100%;
      display: block;
      position: relative;
      &:active {
        color: $background-color-dark;
        text-decoration: none;
        background: $background-color-lightgray-opacity;
        &:after {
          border-top: $background-color-dark solid 4px;
          border-right: $background-color-dark solid 4px;
        }
      }
      &:after {
        margin: auto;
        width: 12px;
        height: 12px;
        content: '';
        border-top: $font-color-lightgray solid 4px;
        border-right: $font-color-lightgray solid 4px;
        position: absolute;
        top: 0;
        right: 24px;
        bottom: 0;
        transform: rotate(45deg);
      }
    }
  }
}
</style>
