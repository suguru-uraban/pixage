<template>
  <div class="headerButtons">
    <HeaderButton to="/signin" :link-to="'signin'" :link-name="$t('header.signIn')" />
    <HeaderButton to="/signup" :link-to="'signup'" :link-name="$t('header.signUp')" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useLink } from '@/compositions/link'
import HeaderButton from '@/components/shared/buttons/HeaderButton.vue'

export default defineComponent({
  components: {
    HeaderButton,
  },
  setup() {
    const { headers } = useLink()
    return {
      headers,
    }
  },
})
</script>

<style lang="scss" scoped>
.headerButtons {
  display: flex;
  > div {
    flex: 1;
  }
}
.pc {
  .headerButtons {
    width: 216px;
    height: 40px;
    > div:nth-last-child(1) {
      margin-left: 16px;
    }
  }
}
.sp {
  .headerButtons {
    width: 148px;
    height: 32px;
    > div:nth-last-child(1) {
      margin-left: 8px;
    }
  }
}
</style>
