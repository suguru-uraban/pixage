<template>
  <div class="void">
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useMeta, computed, provide } from '@nuxtjs/composition-api'
import { useDefaultLang } from '@/compositions/lang'
import { RuleKey } from '@/compositions/key/ruleKey'
import { useRule } from '@/compositions/rule'
import { ActionKey } from '@/compositions/key/actionKey'
import { useAction } from '@/compositions/action'
import { GuardKey } from '@/compositions/key/guardKey'
import { useGuard } from '@/compositions/guard'
import { provideGlobalState } from '@/utils/states/user'

export default defineComponent({
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

    provide(RuleKey, useRule())
    provide(ActionKey, useAction())
    provide(GuardKey, useGuard())

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

    return {}
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.void {
  position: relative;
}
.pc {
  .void {
    min-width: 1200px;
    min-height: calc(100vh - 15px);
  }
}
.sp {
  .void {
    width: 100%;
  }
}
</style>
