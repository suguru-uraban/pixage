<template>
  <div class="header">
    <div class="header__logoWrap"><Logo width="auto" height="28" /></div>
    <div v-if="!isAccountSignIn" class="header__buttonArea">
      <HeaderButtons />
    </div>
    <div class="header__menu">
      <MenuMobile :path="path" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { useLink } from '@/compositions/link'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import Logo from '@/components/shared/Logo.vue'
import HeaderButtons from '@/components/shared/HeaderButtons.vue'
import MenuMobile from '@/components/shared/MenuMobile.vue'

export default defineComponent({
  components: {
    Logo,
    MenuMobile,
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

    return {
      headers,
      isAccountSignIn,
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  padding: 12px 16px;
  width: 100%;
  height: 56px;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  justify-content: space-between;
  background: $background-color-header;
  z-index: $zIndexHeader;
  &__logoWrap {
    display: flex;
    align-items: center;
  }
  &__buttonArea {
    margin-right: 44px;
  }
  &__menu {
    width: 56px;
    height: 56px;
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
  }
  &__menuActive {
    font-size: 1.6rem;
    color: $font-color-white;
    line-height: 40px;
    font-weight: bold;
  }
}
</style>
