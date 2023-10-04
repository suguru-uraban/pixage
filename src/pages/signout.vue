<template>
  <div class="signOut">
    <Logo width="auto" height="40" />
    <p class="signOut__caption">{{ $t('signOut.caption1') }}<br />{{ $t('signOut.caption2') }}</p>
    <nuxt-link to="/" class="signOut__link">{{ $t('signOut.link1') }}</nuxt-link>
    <nuxt-link to="/signin" class="signOut__link">{{ $t('signOut.link2') }}</nuxt-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useContext, useMeta } from '@nuxtjs/composition-api'
import { GuardKey } from '@/compositions/key/guardKey'
import { GuardStore } from '@/compositions/guard'
import Logo from '@/components/shared/Logo.vue'

export default defineComponent({
  components: {
    Logo,
  },
  layout: 'Void',
  setup() {
    const { title, meta } = useMeta()
    const { app } = useContext()

    const { routeGuard } = inject(GuardKey) as GuardStore
    routeGuard()

    title.value = app.i18n.t('signOut.title').toString()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      { hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: 'ログアウト | Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/signout' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]

    return {}
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.signOut {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__caption {
    margin: 32px 0;
    font-size: 1.8rem;
    line-height: 1.6;
    text-align: center;
  }
  &__link {
    font-size: 1.6rem;
    color: $font-color-white;
    line-height: 40px;
    font-weight: bold;
    text-decoration: underline;
  }
}
.pc {
  .signOut {
    width: 500px;
    height: calc(100vh - 15px);
    &__link {
      &:hover {
        text-decoration: none;
      }
    }
  }
}
.sp {
  .signOut {
    padding: 0 16px;
    width: 100%;
    min-height: 100vh;
    &__link {
      &:active {
        text-decoration: none;
      }
    }
  }
}
</style>
