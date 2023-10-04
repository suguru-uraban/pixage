<template>
  <div class="forgotPasswordDone">
    <Logo width="auto" height="40" />
    <h1 class="forgotPasswordDone__title">{{ $t('forgotPasswordDone.title') }}</h1>
    <p class="forgotPasswordDone__caption">
      {{ $t('forgotPasswordDone.caption1') }}<br />{{ $t('forgotPasswordDone.caption2') }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, useContext, useMeta } from '@nuxtjs/composition-api'
import { GuardKey } from '@/compositions/key/guardKey'
import { GuardStore } from '@/compositions/guard'
import Logo from '@/components/shared/Logo.vue'
import { getUserFromCookie } from '@/utils/cookieDecode'

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

    const email = getUserFromCookie(app.$cookie.get('__session'))?.email

    title.value = app.i18n.t('forgotPasswordDone.title').toString()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      { hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: '認証用確認メール送信完了 | Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/forgot-password-sendmail' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]

    return {
      email,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.forgotPasswordDone {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__title {
    margin: 16px 0 32px;
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__caption {
    margin-bottom: 32px;
    line-height: 1.6;
  }
}
.pc {
  .forgotPasswordDone {
    width: 500px;
    height: calc(100vh - 15px);
  }
}
.sp {
  .forgotPasswordDone {
    padding: 0 16px;
    width: 100%;
    min-height: 100vh;
  }
}
</style>
