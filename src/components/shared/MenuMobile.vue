<template>
  <div id="menu" class="menu">
    <transition name="bg">
      <button :class="['menu__icon', { active: isOpenMenu }]" @click="handleOpenMenu">
        <font-awesome-icon v-if="!isOpenMenu" :icon="['fas', 'bars']" />
        <font-awesome-icon v-else :icon="['fas', 'times']" />
      </button>
    </transition>
    <transition name="fade">
      <div v-if="isOpenMenu" class="menu__back">
        <ul class="menu__list">
          <li v-if="isAccountSignIn" class="menu__listAccount">
            <AccountInner />
          </li>
          <li v-for="header in shapeHeaders" :key="header.id" class="menu__listParts">
            <nuxt-link
              v-if="path !== header.path"
              :to="header.path"
              class="menu__listLink"
              @click.native.stop="handleOpenMenu"
            >
              <span class="menu__listIcon">
                <font-awesome-icon :icon="[header.prefix, header.icon]" />
              </span>
              {{ $t(header.value) }}
            </nuxt-link>
            <span v-else class="menu__listActive">
              <span class="menu__listIcon">
                <font-awesome-icon :icon="[header.prefix, header.icon]" />
              </span>
              {{ $t(header.value) }}
            </span>
          </li>
        </ul>
        <div class="menu__footer">
          <Footer width="auto" height="32" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onUpdated } from '@nuxtjs/composition-api'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { useLink } from '@/compositions/link'
import { MenuKey } from '@/compositions/key/menuKey'
import { MenuStore } from '@/compositions/menu'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import AccountInner from '@/components/shared/account/AccountInner.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  components: {
    AccountInner,
    Footer,
  },
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  setup() {
    /** composition-api **/
    const { headers } = useLink()
    /** /composition-api **/

    /** Inject **/
    const { isOpenMenu, handleOpenMenu } = inject(MenuKey) as MenuStore
    const { isAccountSignIn } = inject(AccountKey) as AccountStore
    /** /Inject **/

    /** Computed **/
    const mobileHeaders = computed(() => headers.splice(1, headers.length - 1))
    const shapeHeaders = computed(() => {
      if (!isAccountSignIn.value) {
        return mobileHeaders.value.filter((header) => !header.requireSignIn)
      }
      return mobileHeaders.value
    })
    /** /Computed **/

    /** LifeCycle **/
    onUpdated(() => {
      const menu = document.getElementById('menu')
      if (isOpenMenu.value) {
        disableBodyScroll(menu!)
      } else {
        clearAllBodyScrollLocks()
      }
    })
    /** /LifeCycle **/

    return {
      isAccountSignIn,
      shapeHeaders,
      isOpenMenu,
      handleOpenMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.menu {
  &__icon {
    width: 56px;
    height: 56px;
    font-size: 2.2rem;
    color: $font-color-white;
    line-height: 56px;
    text-align: center;
    position: relative;
    &.active {
      background: $background-color-gray-opacity;
      z-index: $zIndexMobileOverlayIcon;
    }
  }
  &__back {
    width: 100%;
    height: 100%;
    text-align: left;
    position: fixed;
    top: 0;
    left: 0;
    background: $background-color-overlay;
    z-index: $zIndexMobileOverlay;
  }
  &__list {
    width: 100%;
    height: calc(100% - 56px + env(safe-area-inset-bottom));
    position: fixed;
    top: 56px;
    left: 0;
    background: $background-color-gray-opacity;
  }
  &__listParts {
    font-size: 0;
    white-space: nowrap;
    &:nth-last-of-type(1) {
      border-bottom: $border-color-lightgray solid 1px;
    }
  }
  &__listAccount {
    margin: 16px;
    border-radius: 0 8px 8px 8px;
    border: $border-color-lightgray solid 2px;
    box-shadow: 2px 4px 4px $shadow-color;
  }
  &__listLink,
  &__listActive {
    padding: 12px 16px;
    font-size: 2rem;
    font-weight: bold;
    position: relative;
    display: block;
    white-space: nowrap;
    border-top: $border-color-lightgray solid 1px;
  }
  &__listLink {
    color: $font-color-white;
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
  &__listActive {
    color: $font-color-darkgray;
  }
  &__listIcon {
    margin-right: 4px;
    width: 20px;
    font-size: 2rem;
    display: inline-block;
    text-align: center;
  }
  &__footer {
    width: 100%;
    position: absolute;
    bottom: calc(56px + env(safe-area-inset-bottom));
    left: 0;
  }
}
</style>
