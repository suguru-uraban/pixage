<template>
  <div class="forgotPassword">
    <Logo width="auto" height="40" />
    <h1 class="forgotPassword__title">{{ $t('forgotPassword.title') }}</h1>
    <div class="forgotPassword__area">
      <p class="forgotPassword__caption">{{ $t('forgotPassword.caption1') }}</p>
      <p class="forgotPassword__caption">{{ $t('forgotPassword.caption2') }}</p>
      <form @submit.prevent="clickSendMail()">
        <dl class="forgotPassword__inputArea">
          <dt class="forgotPassword__inputTitle">
            {{ $t('forgotPassword.email') }}<span>{{ $t('forgotPassword.required') }}</span>
          </dt>
          <dd class="forgotPassword__inputBlock">
            <input
              v-model="email"
              type="text"
              placeholder="user@example.com"
              :class="[
                'forgotPassword__inputText',
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
        <div class="forgotPassword__inputButtonArea">
          <Error v-if="errorMessage !== ''" :message="errorMessage" type="total" />
          <button class="forgotPassword__inputButton">
            {{ $t('forgotPassword.button') }}
          </button>
        </div>
      </form>
    </div>
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
import { ForgotPasswordKey } from '@/compositions/key/forgotPasswordKey'
import { ForgotPasswordStore, useForgotPassword } from '@/compositions/forgotPassword'
import { RuleKey } from '@/compositions/key/ruleKey'
import { RuleStore } from '@/compositions/rule'
import Logo from '@/components/shared/Logo.vue'
import Error from '@/components/shared/Error.vue'

export default defineComponent({
  components: {
    Logo,
    Error,
  },
  layout: 'Void',
  setup() {
    const { app } = useContext()
    const { title, meta } = useMeta()

    const email = ref<string>('')
    const isDirty = reactive({
      email: false,
    })

    provide(ForgotPasswordKey, useForgotPassword())

    const { sendMail, errorMessage } = inject(ForgotPasswordKey) as ForgotPasswordStore
    const { required, emailFormat } = inject(RuleKey) as RuleStore

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
    })

    const clickSendMail = async () => {
      if (!params.$anyInvalid) {
        sendMail(email.value)
      } else {
        if (params.email.$anyInvalid) isDirty.email = true
        return await params.$touch()
      }
    }

    const resetInput = (input: string) => {
      switch (input) {
        case 'email':
          params.email.$reset()
          isDirty.email = false
          errorMessage.value = ''
          break
      }
    }

    title.value = app.i18n.t('forgotPassword.title').toString()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      { hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: 'パスワード再設定メール送信 | Pixage' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/forgot-password' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]

    return {
      errorMessage,
      email,
      isDirty,
      params,
      resetInput,
      clickSendMail,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.forgotPassword {
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
    margin-bottom: 16px;
    line-height: 1.4;
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
}
.pc {
  .forgotPassword {
    padding: 24px 0;
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
  }
}
.sp {
  .forgotPassword {
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
  }
}
</style>
