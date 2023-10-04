<template>
  <div :class="['header', { isSignOut: !isAccountSignIn }]">
    <div class="header__logoWrap"><Logo width="auto" height="40" /></div>
    <ul class="header__menu">
      <li v-for="header in shapeHeaders" :key="header.id" class="header__menuParts">
        <nuxt-link v-if="path !== header.path" :to="header.path" class="header__menuLink">
          <font-awesome-icon :icon="[header.prefix, header.icon]" />
          {{ $t(header.value) }}
        </nuxt-link>
        <span v-else class="header__menuActive">
          <font-awesome-icon :icon="[header.prefix, header.icon]" />
          {{ $t(header.value) }}
        </span>
      </li>
    </ul>
    <AccountDesktop v-if="isAccountSignIn" />
    <div v-if="!isAccountSignIn" class="header__buttonArea">
      <HeaderButtons />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@nuxtjs/composition-api'
import { useLink } from '@/compositions/link'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import Logo from '@/components/shared/Logo.vue'
import HeaderButtons from '@/components/shared/HeaderButtons.vue'
import AccountDesktop from '@/components/shared/AccountDesktop.vue'

export default defineComponent({
  components: {
    Logo,
    AccountDesktop,
    HeaderButtons,
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
    const { isAccountSignIn } = inject(AccountKey) as AccountStore
    /** /Inject **/

    /** Computed **/
    const shapeHeaders = computed(() => {
      if (!isAccountSignIn.value) {
        return headers.filter((header) => !header.requireSignIn)
      }
      return headers
    })
    /** /Computed **/

    return {
      shapeHeaders,
      isAccountSignIn,
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  padding: 20px 95px 20px 24px;
  width: 100vw;
  min-width: 1200px;
  height: 80px;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  background: $background-color-header;
  z-index: $zIndexHeader;
  &.isSignOut {
    padding: 20px 263px 20px 24px;
  }
  &__logoWrap {
    display: flex;
    align-items: center;
  }
  &__menu {
    margin-left: 32px;
    height: 40px;
  }
  &__menuParts {
    margin-right: 16px;
    font-size: 0;
    display: inline-block;
    &:nth-last-of-type(1) {
      margin-right: 24px;
    }
  }
  &__menuLink {
    font-size: 1.6rem;
    color: $font-color-gray;
    line-height: 40px;
    font-weight: bold;
    &:hover {
      color: $font-color-white;
      text-decoration: underline;
    }
  }
  &__menuActive {
    font-size: 1.6rem;
    color: $font-color-white;
    line-height: 40px;
    font-weight: bold;
  }
  &__buttonArea {
    position: absolute;
    top: 20px;
    left: calc(100% - 247px);
  }
}
</style>
