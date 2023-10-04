<template>
  <div class="signupPage">
    <Logo width="auto" height="40" />
    <h1 class="signupPage__title">{{ $t('signUp.title') }}</h1>
    <div class="signupPage__area">
      <dl class="signupPage__socialArea">
        <dt class="signupPage__socialTitle">{{ $t('signUp.signUpWithSocialAccount') }}</dt>
        <dd class="signupPage__link">
          <nuxt-link to="/signin">{{ $t('signUp.link') }}</nuxt-link>
        </dd>
      </dl>
      <p class="signupPage__caption">{{ $t('signUp.signUpWithEmailAndPassword') }}</p>
      <ul class="signupPage__attentionList head">
        <li class="signupPage__attentionListParts">
          {{ $t('signUp.showAgreement') }}
        </li>
      </ul>
      <div class="signupPage__link">
        <nuxt-link to="/terms">{{ $t('signUp.linkAgreement') }}</nuxt-link>
      </div>
      <form @submit.prevent="clickSignUp()">
        <dl class="signupPage__inputArea">
          <dt class="signupPage__inputTitle">
            {{ $t('signUp.displayName') }}<span>{{ $t('signUp.required') }}</span>
          </dt>
          <dd class="signupPage__inputBlock">
            <input
              v-model="displayName"
              type="text"
              placeholder="UserName"
              :class="[
                'signupPage__inputText',
                { inValid: isDirty.displayName && params.displayName.$anyInvalid },
              ]"
              @focus="resetInput('displayName')"
            />
            <Error
              v-if="
                isDirty.displayName &&
                params.displayName.$dirty &&
                params.displayName.required.$invalid
              "
              :message="params.displayName.required.$message"
              type="input"
            />
            <Error
              v-if="
                isDirty.displayName &&
                params.displayName.$dirty &&
                params.displayName.format.$invalid
              "
              :message="params.displayName.format.$message"
              type="input"
            />
          </dd>
        </dl>
        <dl class="signupPage__inputArea">
          <dt class="signupPage__inputTitle">
            {{ $t('signUp.email') }}<span>{{ $t('signUp.required') }}</span>
          </dt>
          <dd class="signupPage__inputBlock">
            <input
              v-model="email"
              type="text"
              placeholder="user@example.com"
              :class="[
                'signupPage__inputText',
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
        <dl class="signupPage__inputArea">
          <dt class="signupPage__inputTitle">
            {{ $t('signUp.password') }}<span>{{ $t('signUp.required') }}</span>
          </dt>
          <dd class="signupPage__inputBlock">
            <input
              v-model="password"
              type="password"
              placeholder="password"
              :class="[
                'signupPage__inputText',
                { inValid: isDirty.password && params.password.$anyInvalid },
              ]"
              @focus="resetInput('password')"
            />
            <Error
              v-if="isDirty.password && params.password.$dirty && params.password.required.$invalid"
              :message="params.password.required.$message"
              type="input"
            />
            <Error
              v-if="isDirty.password && params.password.$dirty && params.password.format.$invalid"
              :message="params.password.format.$message"
              type="input"
            />
          </dd>
        </dl>
        <dl class="signupPage__inputArea">
          <dt class="signupPage__inputTitle">
            {{ $t('signUp.passwordVerify') }}<span>{{ $t('signUp.required') }}</span>
          </dt>
          <dd class="signupPage__inputBlock">
            <input
              v-model="passwordVerify"
              type="password"
              placeholder="password"
              :class="[
                'signupPage__inputText',
                { inValid: isDirty.passwordVerify && params.passwordVerify.$anyInvalid },
              ]"
              @focus="resetInput('passwordVerify')"
            />
            <Error
              v-if="
                isDirty.passwordVerify &&
                params.passwordVerify.$dirty &&
                params.passwordVerify.match.$invalid
              "
              :message="params.passwordVerify.match.$message"
              type="input"
            />
          </dd>
        </dl>
        <div class="signupPage__check">
          <input id="agreement" v-model="agreement" type="checkbox" name="agreement" /><label
            for="agreement"
          />{{ $t('signUp.doneAgreement') }}
          <Error
            v-if="
              isDirty.agreement && params.agreement.$dirty && params.agreement.required.$invalid
            "
            :message="params.agreement.required.$message"
            type="input"
          />
        </div>
        <div class="signupPage__inputButtonArea">
          <Error v-if="errorMessage !== ''" :message="errorMessage" type="total" />
          <button class="signupPage__inputButton" :disabled="processing">
            {{ $t('signUp.button') }}
          </button>
        </div>
        <ul class="signupPage__attentionList">
          <li class="signupPage__attentionListParts">
            {{ $t('signUp.attention1') }}
          </li>
          <li class="signupPage__attentionListParts">
            {{ $t('signUp.attention2') }}
          </li>
        </ul>
      </form>
    </div>
    <p class="signupPage__back">
      <nuxt-link to="/">{{ $t('signUp.back') }}</nuxt-link>
    </p>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  provide,
  reactive,
  ref,
  useContext,
  useMeta,
} from '@nuxtjs/composition-api'
import { useValidation } from 'vue-composable'
import { SignUpKey } from '@/compositions/key/signUpKey'
import { SignUpStore, useSignUp } from '@/compositions/signUp'
import { RuleStore } from '@/compositions/rule'
import { RuleKey } from '@/compositions/key/ruleKey'
import { GuardKey } from '@/compositions/key/guardKey'
import { GuardStore } from '@/compositions/guard'
import Logo from '@/components/shared/Logo.vue'
import Error from '@/components/shared/Error.vue'

export default defineComponent({
  name: 'SignUpPage',
  components: {
    Logo,
    Error,
  },
  layout: 'Void',
  setup() {
    const { app } = useContext()
    const { title, meta } = useMeta()

    const processing = ref<boolean>(false)
    const displayName = ref<string>('')
    const email = ref<string>('')
    const password = ref<string>('')
    const passwordVerify = ref<string>('')
    const isDirty = reactive({
      displayName: false,
      email: false,
      password: false,
      passwordVerify: false,
      agreement: false,
    })
    const agreement = ref<boolean>(false)

    provide(SignUpKey, useSignUp())

    const { signUp, errorMessage } = inject(SignUpKey) as SignUpStore
    const { required, displayNameLength, emailFormat, passwordFormat, check } = inject(
      RuleKey
    ) as RuleStore
    const { alreadyLoggedGuard } = inject(GuardKey) as GuardStore
    alreadyLoggedGuard()

    const params = useValidation({
      displayName: {
        $value: displayName,
        required: {
          $validator: required,
          $message: app.i18n.t('validate.displayNameIsRequired'),
        },
        format: {
          $validator: displayNameLength,
          $message: app.i18n.t('validate.displayNameFormatIsInValid'),
        },
      },
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
        required: {
          $validator: required,
          $message: app.i18n.t('validate.passwordIsRequired'),
        },
        format: {
          $validator: passwordFormat,
          $message: app.i18n.t('validate.passwordFormatIsInValid'),
        },
      },
      passwordVerify: {
        $value: passwordVerify,
        match: {
          $validator(x: string) {
            return x === password.value
          },
          $message: app.i18n.t('validate.passwordDoNotMatch'),
        },
      },
      agreement: {
        $value: agreement,
        required: {
          $validator: check,
          $message: app.i18n.t('validate.notAgreement'),
        },
      },
    })

    const clickSignUp = async () => {
      if (!params.$anyInvalid) {
        processing.value = true
        signUp(displayName.value, email.value, password.value).then(() => {
          processing.value = false
        })
      } else {
        if (params.displayName.$anyInvalid) isDirty.displayName = true
        if (params.email.$anyInvalid) isDirty.email = true
        if (params.password.$anyInvalid) isDirty.password = true
        if (params.passwordVerify.$anyInvalid) isDirty.passwordVerify = true
        if (params.agreement.$anyInvalid) isDirty.agreement = true
        return await params.$touch()
      }
    }

    const resetInput = (input: string) => {
      switch (input) {
        case 'displayName':
          params.displayName.$reset()
          isDirty.displayName = false
          errorMessage.value = ''
          break
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
        case 'passwordVerify':
          params.passwordVerify.$reset()
          isDirty.passwordVerify = false
          errorMessage.value = ''
          break
        case 'agreement':
          params.agreement.$reset()
          isDirty.agreement = false
          errorMessage.value = ''
          break
      }
    }

    title.value = app.i18n.t('signUp.title').toString()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content:
          '「Pixage」は無料で会員登録することができます。会員登録すれば全ての機能を利用することができます。メールアドレス、Twitterアカウントで登録可能！',
      },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: '会員登録 | Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          '「Pixage」は無料で会員登録することができます。会員登録すれば全ての機能を利用することができます。メールアドレス、Twitterアカウントで登録可能！',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/signup' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]

    return {
      errorMessage,
      displayName,
      processing,
      email,
      password,
      passwordVerify,
      isDirty,
      agreement,
      params,
      resetInput,
      clickSignUp,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.signupPage {
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
    padding: 8px 0 24px;
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
  &__inputButtonArea {
    padding: 12px 0 24px;
    text-align: center;
    position: relative;
  }
  &__inputButton {
    width: 120px;
    height: 40px;
    color: $font-color-white;
    border-radius: 8px;
    border: $button-color-singUp-border solid 1px;
    background: $button-color-singUp-bg;
  }
  &__attentionList {
    padding-left: 1.2rem;
    text-indent: -1rem;
    &.head {
      margin-bottom: 16px;
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
  &__socialTitle {
    font-weight: normal;
    line-height: 1.4;
  }
  &__link {
    margin: 24px 0;
    text-align: center;
    a {
      font-size: 1.6rem;
      font-weight: bold;
      text-decoration: underline;
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
  .signupPage {
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
    &__link {
      a:hover {
        text-decoration: none;
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
  .signupPage {
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
    &__link {
      a:active {
        text-decoration: none;
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
