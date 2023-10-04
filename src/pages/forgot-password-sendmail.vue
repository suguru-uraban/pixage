<template>
  <div class="forgotPasswordSendmail">
    <Logo width="auto" height="40" />
    <h1 class="forgotPasswordSendmail__title">{{ $t('forgotPasswordSendMail.title') }}</h1>
    <p class="forgotPasswordSendmail__caption">
      {{ $t('forgotPasswordSendMail.caption1') }}<br />{{ $t('forgotPasswordSendMail.caption2') }}
    </p>
    <nuxt-link to="/" class="forgotPasswordSendmail__link">{{
      $t('forgotPasswordSendMail.link')
    }}</nuxt-link>
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

    title.value = app.i18n.t('forgotPasswordSendMail.title').toString()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      { hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: 'パスワード再設定メール送信完了 | Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/forgot-password-sendmail' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]

    return {}
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.forgotPasswordSendmail {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__title {
    margin: 16px 0 24px;
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__caption {
    margin-bottom: 32px;
    line-height: 1.6;
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
  .forgotPasswordSendmail {
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
  .forgotPasswordSendmail {
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
