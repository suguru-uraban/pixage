<template>
  <div>
    <client-only>
      <div class="agreementTwitterSignIn">
        <Logo width="auto" height="40" />
        <h1 class="agreementTwitterSignIn__title">{{ $t('agreementTwitterSignIn.title') }}</h1>
        <div class="agreementTwitterSignIn__area">
          <dl class="agreementTwitterSignIn__socialArea">
            <dt class="agreementTwitterSignIn__caption">
              {{ $t('agreementTwitterSignIn.caption') }}
            </dt>
            <dd class="agreementTwitterSignIn__check">
              <input
                id="agreement"
                type="checkbox"
                name="agreement"
                @change="clickAgreement"
              /><label for="agreement" />{{ $t('agreementTwitterSignIn.doneAgreement') }}
            </dd>
            <dd>
              <div v-if="agreement" class="agreementTwitterSignIn__link">
                <nuxt-link to="/">{{ $t('agreementTwitterSignIn.goToTop') }}</nuxt-link>
              </div>
              <div v-if="!agreement" class="agreementTwitterSignIn__link">
                <span>{{ $t('agreementTwitterSignIn.goToTop') }}</span>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useMeta } from '@nuxtjs/composition-api'
import { $cookiesOpt, $cookiesOptDelete } from '@/plugins/cookie'
import Logo from '@/components/shared/Logo.vue'

export default defineComponent({
  components: {
    Logo,
  },
  layout: 'Void',
  setup() {
    /** composition-api **/
    const { app, redirect } = useContext()
    const { title, meta } = useMeta()
    /** /composition-api **/

    if (!app.$cookie.get('__session') && !app.$cookie.get('notAgreement')) {
      redirect('/')
    }

    const agreement = ref<boolean>(false)

    const clickAgreement = () => {
      if (!agreement.value) {
        agreement.value = true
        app.$cookie.set('notAgreement', false, $cookiesOptDelete)
      } else {
        agreement.value = false
        if (!app.$cookie.get('notAgreement')) {
          app.$cookie.set('notAgreement', true, $cookiesOpt)
        }
      }
    }

    /** Meta **/
    title.value = app.i18n.t('signIn.title').toString()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content:
          'ログインすれば「Pixage」の機能を全て使うことができます。漫画を読みたい読者、漫画を描きたいクリエイター、どちらでも今すぐログイン！',
      },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: 'ログイン | Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'ログインすれば「Pixage」の機能を全て使うことができます。漫画を読みたい読者、漫画を描きたいクリエイター、どちらでも今すぐログイン！',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/signin' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]
    /** /Meta **/

    return {
      agreement,
      clickAgreement,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.agreementTwitterSignIn {
  padding: 48px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__title {
    margin-top: 16px;
    font-size: 1.6rem;
    font-weight: bold;
  }
  &__caption {
    font-weight: normal;
  }
  &__check {
    padding: 24px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    input[type='checkbox'] {
      display: none;
    }
    label {
      margin-right: 8px;
      width: 24px;
      height: 24px;
      line-height: 30px;
      text-align: center;
      display: block;
      position: relative;
      border-radius: 4px;
      border: $border-color-lightgray solid 2px;
      background: $background-color-white;
    }
    input[type='checkbox']:checked + label:after {
      width: 10px;
      height: 16px;
      content: '';
      display: block;
      position: absolute;
      left: 5px;
      border-right: $border-color-gray solid 3px;
      border-bottom: $border-color-gray solid 3px;
      transform: rotate(45deg);
    }
  }
  &__link {
    margin: 24px 0;
    text-align: center;
    a,
    span {
      font-size: 1.6rem;
      font-weight: bold;
    }
    a {
      text-decoration: underline;
    }
    span {
      color: $font-color-gray;
    }
  }
}
.pc {
  .agreementTwitterSignIn {
    min-height: calc(100vh - 15px);
    &__area {
      margin-top: 16px;
      padding: 24px;
      width: 400px;
      border-radius: 4px;
      box-shadow: 4px 4px 2px $shadow-color;
      background: $background-color-darkgray-opacity;
    }
    &__link {
      a:hover {
        text-decoration: none;
      }
    }
  }
}
.sp {
  .agreementTwitterSignIn {
    min-height: 100vh;
    &__area {
      margin-top: 24px;
      padding: 0 24px;
      width: 100%;
    }
    &__link {
      a:active {
        text-decoration: none;
      }
    }
  }
}
</style>
