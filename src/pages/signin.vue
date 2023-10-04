<template>
  <div>
    <client-only>
      <Loading v-if="loadingSignIn" page-type="full" />
      <div v-if="!loadingSignIn" class="signinPage">
        <Logo width="auto" height="40" />
        <h1 class="signinPage__title">{{ $t('signIn.title') }}</h1>
        <div class="signinPage__area">
          <dl class="signinPage__socialArea">
            <dt class="signinPage__socialTitle">{{ $t('signIn.signInWithSocialAccount') }}</dt>
            <dd>
              <ul class="signinPage__attentionList head">
                <li class="signinPage__attentionListParts">
                  {{ $t('signIn.showAgreement') }}
                </li>
              </ul>
              <div class="signinPage__link">
                <nuxt-link to="/terms">{{ $t('signIn.linkAgreement') }}</nuxt-link>
              </div>
            </dd>
            <dd class="signinPage__socialLink">
              <button class="signinPage__socialButton" @click="clickSignInWithTwitter">
                <img src="@/assets/images/logo_twitter.svg" alt="Twitter" />{{
                  $t('signIn.signInWithTwitterAccount')
                }}
              </button>
            </dd>
          </dl>
          <div class="signinPage__check">
            <input
              id="stayLoggedInTwitter"
              v-model="stayLoggedInTwitter"
              type="checkbox"
              name="stayLoggedInTwitter"
            /><label for="stayLoggedInTwitter" />{{ $t('signIn.stayLoggedIn') }}
          </div>
          <ul class="signinPage__attentionList">
            <li class="signinPage__attentionListParts">
              {{ $t('signIn.attention') }}
            </li>
          </ul>

          <p class="signinPage__caption">{{ $t('signIn.signInWithEmailAndPassword') }}</p>
          <form @submit.prevent="clickSignIn()">
            <dl class="signinPage__inputArea">
              <dt class="signinPage__inputTitle">
                {{ $t('signIn.email') }}<span>{{ $t('signIn.required') }}</span>
              </dt>
              <dd class="signinPage__inputBlock">
                <input
                  v-model="email"
                  type="text"
                  placeholder="user@example.com"
                  :class="[
                    'signinPage__inputText',
                    { inValid: isDirty.email && params.email.$anyInvalid },
                  ]"
                  @focus="resetInput('email')"
                />
                <Error
                  v-if="isDirty.email && params.email.$dirty && params.email.required.$invalid"
                  :message="params.email.required.$message"
                  type="input"
                />
                <Error
                  v-if="isDirty.email && params.email.$dirty && params.email.format.$invalid"
                  :message="params.email.format.$message"
                  type="input"
                />
              </dd>
            </dl>
            <dl class="signinPage__inputArea">
              <dt class="signinPage__inputTitle">
                {{ $t('signIn.password') }}<span>{{ $t('signIn.required') }}</span>
              </dt>
              <dd class="signinPage__inputBlock">
                <input
                  v-model="password"
                  type="password"
                  placeholder="password"
                  :class="[
                    'signinPage__inputText',
                    { inValid: isDirty.password && params.password.$anyInvalid },
                  ]"
                  @focus="resetInput('password')"
                />
                <Error
                  v-if="isDirty.password && params.password.$dirty && params.password.$anyInvalid"
                  :message="params.password.$message"
                  type="input"
                />
              </dd>
            </dl>
            <div class="signinPage__check">
              <input
                id="stayLoggedIn"
                v-model="stayLoggedIn"
                type="checkbox"
                name="stayLoggedIn"
              /><label for="stayLoggedIn" />{{ $t('signIn.stayLoggedIn') }}
            </div>
            <ul class="signinPage__attentionList">
              <li class="signinPage__attentionListParts">
                {{ $t('signIn.attention') }}
              </li>
            </ul>
            <div class="signinPage__inputButtonArea">
              <Error v-if="errorMessage !== ''" :message="errorMessage" type="total" />
              <button class="signinPage__inputButton" :disabled="processing">
                {{ $t('signIn.button') }}
              </button>
            </div>
            <div class="signinPage__forgotPasswordLink">
              <nuxt-link to="/forgot-password">{{ $t('signIn.forgotPassword') }}</nuxt-link>
            </div>
          </form>
        </div>
        <p class="signinPage__back">
          <nuxt-link to="/">{{ $t('signUp.back') }}</nuxt-link>
        </p>
      </div>
    </client-only>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  provide,
  reactive,
  ref,
  useContext,
  useMeta,
} from '@nuxtjs/composition-api'
import { useValidation } from 'vue-composable'
import { SignInKey } from '@/compositions/key/signInKey'
import { SignInStore, useSignIn } from '@/compositions/signIn'
import { RuleKey } from '@/compositions/key/ruleKey'
import { RuleStore } from '@/compositions/rule'
import { GuardKey } from '@/compositions/key/guardKey'
import { GuardStore } from '@/compositions/guard'
import Loading from '@/components/Loading.vue'
import Logo from '@/components/shared/Logo.vue'
import Error from '@/components/shared/Error.vue'

export default defineComponent({
  name: 'SigninPage',
  components: {
    Logo,
    Error,
    Loading,
  },
  layout: 'Void',
  setup() {
    const { app } = useContext()
    const { title, meta } = useMeta()

    const processing = ref<boolean>(false)
    const email = ref<string>('')
    const password = ref<string>('')
    const isDirty = reactive({
      email: false,
      password: false,
    })
    const stayLoggedIn = ref<boolean>(false)
    const stayLoggedInTwitter = ref<boolean>(false)

    provide(SignInKey, useSignIn())

    const { errorMessage, loadingSignIn, signIn, signInWithTwitter, redirectTwitterToSignIn } =
      inject(SignInKey) as SignInStore
    const { required, emailFormat } = inject(RuleKey) as RuleStore
    const { alreadyLoggedGuard } = inject(GuardKey) as GuardStore

    alreadyLoggedGuard()

    const params = useValidation({
      email: {
        $value: email,
        required: {
          $validator: required,
          $message: app.i18n.t('validate.emailIsRequired'),
        },
        format: {
          $validator: emailFormat,
          $message: app.i18n.t('validate.emailFormatIsInValid'),
        },
      },
      password: {
        $value: password,
        required,
        $message: app.i18n.t('validate.passwordIsRequired'),
      },
    })

    const clickSignIn = async () => {
      if (!params.$anyInvalid) {
        processing.value = true
        signIn(email.value, password.value, stayLoggedIn.value).then(() => {
          processing.value = false
        })
      } else {
        if (params.email.$anyInvalid) isDirty.email = true
        if (params.password.$anyInvalid) isDirty.password = true
        return await params.$touch()
      }
    }

    const clickSignInWithTwitter = () => {
      if (stayLoggedInTwitter.value) {
        app.$cookie.set('stayLoggedInTwitter', true)
      }
      signInWithTwitter()
    }

    onMounted(() => {
      redirectTwitterToSignIn()
    })

    const resetInput = (input: string) => {
      switch (input) {
        case 'email':
          params.email.$reset()
          isDirty.email = false
          errorMessage.value = ''
          break
        case 'password':
          params.password.$reset()
          isDirty.password = false
          errorMessage.value = ''
          break
      }
    }

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

    return {
      errorMessage,
      loadingSignIn,
      processing,
      email,
      password,
      isDirty,
      stayLoggedIn,
      stayLoggedInTwitter,
      params,
      resetInput,
      clickSignIn,
      clickSignInWithTwitter,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.signinPage {
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
    margin-bottom: 24px;
    padding-top: 24px;
    border-top: $border-color-gray solid 1px;
  }
  &__inputArea {
    margin-bottom: 24px;
    padding: 0 8px;
  }
  &__inputBlock {
    padding-bottom: 16px;
    position: relative;
  }
  &__inputTitle {
    margin-bottom: 8px;
    span {
      margin-left: 4px;
      font-size: 1.2rem;
      color: $font-color-red;
    }
  }
  &__inputText {
    padding: 4px;
    width: 100%;
    height: 40px;
    font-size: 1.6rem;
    color: $font-color-darkgray;
    border-radius: 4px;
    border: $border-color-gray solid 1px;
    background: $background-color-white;
    &.inValid {
      border: $border-color-red solid 1px;
      background: $background-color-pink;
    }
  }
  &__check {
    padding: 8px;
    display: flex;
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
  &__attentionList {
    margin: 0 8px 24px;
    padding-left: 1.2rem;
    text-indent: -1rem;
    &.head {
      margin: 16px 0;
    }
  }
  &__attentionListParts {
    margin-bottom: 8px;
    font-size: 1.2rem;
    line-height: 1.4;
    &:before {
      content: '※';
    }
  }
  &__inputButtonArea {
    padding: 12px 0 16px;
    text-align: center;
    position: relative;
  }
  &__inputButton {
    width: 120px;
    height: 40px;
    color: $font-color-darkgray;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
  }
  &__link {
    margin: 8px 0 24px;
    text-align: center;
    a {
      font-size: 1.6rem;
      font-weight: bold;
      text-decoration: underline;
    }
  }
  &__forgotPasswordLink {
    padding-bottom: 24px;
    text-align: center;
    a {
      text-decoration: underline;
    }
  }
  &__socialArea {
    padding-bottom: 24px;
  }
  &__socialTitle {
    font-weight: normal;
  }
  &__socialLink {
    margin-top: 16px;
    text-align: center;
  }
  &__socialButton {
    padding: 8px 16px;
    width: 100%;
    color: $font-color-darkgray;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: $button-color-normal-border solid 1px;
    background: $button-color-normal-bg;
    img {
      margin-right: 8px;
      width: auto;
      height: 24px;
    }
  }
  &__back {
    margin-top: 24px;
    text-align: right;
    a {
      text-decoration: underline;
    }
  }
}
.pc {
  .signinPage {
    min-height: calc(100vh - 15px);
    &__area {
      margin-top: 16px;
      padding: 24px;
      width: 400px;
      border-radius: 4px;
      box-shadow: 4px 4px 2px $shadow-color;
      background: $background-color-darkgray-opacity;
    }
    &__inputButton {
      &:hover {
        opacity: 0.6;
      }
    }
    &__forgotPasswordLink {
      a:hover {
        text-decoration: none;
      }
    }
    &__socialButton {
      &:hover {
        opacity: 0.6;
      }
    }
    &__back {
      width: 400px;
      a:hover {
        text-decoration: none;
      }
    }
  }
}
.sp {
  .signinPage {
    min-height: 100vh;
    &__area {
      margin-top: 24px;
      padding: 0 24px;
      width: 100%;
    }
    &__inputButton {
      &:active {
        opacity: 0.6;
      }
    }
    &__forgotPasswordLink {
      a:active {
        text-decoration: none;
      }
    }
    &__socialButton {
      &:active {
        opacity: 0.6;
      }
    }
    &__back {
      padding: 0 16px;
      width: 100%;
      a:active {
        text-decoration: none;
      }
    }
  }
}
</style>
