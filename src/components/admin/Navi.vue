<template>
  <ul class="adminNavi">
    <li v-for="link in shapeAdminLinks" :key="link.id" class="adminNavi__block">
      <nuxt-link v-if="path !== link.path" :to="link.path">
        <font-awesome-icon :icon="[link.prefix, link.icon]" />
        <span class="adminNavi__pageName">{{ link.value }}</span>
      </nuxt-link>
      <span v-else class="adminNavi__noLink">
        <font-awesome-icon :icon="[link.prefix, link.icon]" />
        <span class="adminNavi__pageName">{{ link.value }}</span>
      </span>
    </li>
    <li class="adminNavi__block back">
      <nuxt-link to="/">
        <font-awesome-icon :icon="['fa', 'backward']" />
        Pixageへ戻る
      </nuxt-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useAdminLink } from '@/compositions/adminLink'
import { injectGlobalState } from '@/utils/states/user'

export default defineComponent({
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  setup() {
    /** composition-api **/
    const { links } = useAdminLink()
    /** /composition-api **/

    /** Inject **/
    const state = injectGlobalState()
    /** /Inject **/

    /** Computed **/
    const shapeAdminLinks = computed(() => {
      if (state.role.value !== 'admin') {
        return links.filter((link) => link.role.includes('staff'))
      }
      return links
    })
    /** /Computed **/

    return {
      shapeAdminLinks,
    }
  },
})
</script>

<style lang="scss" scoped>
.adminNavi {
  width: 160px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  background: $background-color-white;
  box-shadow: 4px 4px 4px $shadow-color;
  z-index: 2;
  &__block {
    width: 100%;
    min-height: 48px;
    a,
    .adminNavi__noLink {
      padding: 8px 8px 8px 32px;
      width: 100%;
      height: 48px;
      font-size: 12px;
      line-height: 16px;
      display: flex;
      align-items: center;
      position: relative;
      border-bottom: $border-color-dark solid 1px;
      &:hover {
        background: $background-color-gray-admin-hover;
      }
      svg {
        margin: auto;
        width: 20px;
        height: auto;
        position: absolute;
        top: 0;
        left: 8px;
        bottom: 0;
      }
    }
    .adminNavi__noLink {
      background: $background-color-gray-admin-hover;
    }
  }
  &__pageName {
    white-space: pre-line;
  }
  .back {
    margin-top: 40px;
    border-top: $border-color-dark solid 1px;
  }
}
</style>
