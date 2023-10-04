<template>
  <div class="verify-sendmail">
    <Logo width="auto" height="40" />
    <h1 class="verify-sendmail__title">{{ $t('verifySendMail.title') }}</h1>
    <p class="verify-sendmail__email">{{ email }}</p>
    <p class="verify-sendmail__caption">{{ $t('verifySendMail.caption1') }}</p>
    <div class="verify-sendmail__linkArea">
      <nuxt-link to="/" class="verify-sendmail__link">{{ $t('verifySendMail.link') }}</nuxt-link>
    </div>
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

    title.value = app.i18n.t('verifySendMail.title').toString()
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
.verify-sendmail {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__title {
    margin-top: 16px;
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__email {
    margin: 32px 0;
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    word-break: break-all;
  }
  &__caption {
    margin-bottom: 32px;
    line-height: 1.6;
  }
  &__linkArea {
    text-align: center;
  }
  &__link {
    font-size: 1.6rem;
    color: $font-color-white;
    line-height: 40px;
    font-weight: bold;
    text-decoration: underline;
    display: inline-block;
  }
}
.pc {
  .verify-sendmail {
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
  .verify-sendmail {
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
