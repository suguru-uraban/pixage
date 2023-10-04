<template>
  <div :class="['account', { active: isOpenAccountMenu }]" @click="handleOpenAccountMenu">
    <font-awesome-icon :icon="['far', 'user']" />
    <AccountInner />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { AccountKey } from '@/compositions/key/accountKey'
import { AccountStore } from '@/compositions/account'
import AccountInner from '@/components/shared/account/AccountInner.vue'

export default defineComponent({
  components: {
    AccountInner,
  },
  setup() {
    /** Inject **/
    const { isOpenAccountMenu, handleOpenAccountMenu } = inject(AccountKey) as AccountStore
    /** /Inject **/

    return {
      isOpenAccountMenu,
      handleOpenAccountMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.account {
  width: 64px;
  height: 64px;
  font-size: 40px;
  color: $font-color-white;
  line-height: 64px;
  text-align: center;
  position: absolute;
  top: 8px;
  left: calc(100% - 88px);
  border-radius: 4px;
  &:hover {
    background: $background-color-gray-hover;
  }
  &.active {
    border-radius: 4px 4px 0 0;
    background: $background-color-gray-opacity;
  }
}
</style>
