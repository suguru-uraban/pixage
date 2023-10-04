<template>
  <div class="action">
    <Loading v-if="isLoading" page-type="full" />
    <div v-if="isInvalidError" class="invalidAction">
      <Logo width="auto" height="40" />
      <h1 class="invalidAction__title">{{ $t('invalidAction.title') }}</h1>
      <div class="invalidAction__content">
        <p class="invalidAction__caption">
          {{ $t('invalidAction.caption1') }}<br />{{ $t('invalidAction.caption2') }}
        </p>
        <div class="invalidAction__linkArea">
          <a href="/" class="invalidAction__link">{{ $t('invalidAction.link') }}</a>
        </div>
      </div>
    </div>
    <div v-if="!isInvalidError && mode === 'verifyEmail'" class="verifyAccount">
      <Logo width="auto" height="40" />
      <h1 class="verifyAccount__title">{{ $t('verifyAccount.title') }}</h1>
      <div class="verifyAccount__content">
        <p class="verifyAccount__caption">
          {{ $t('verifyAccount.caption1') }}<br />{{ $t('verifyAccount.caption2') }}
        </p>
      </div>
    </div>
    <div v-if="!isInvalidError && mode === 'resetPassword'" class="resetPassword">
      <Logo width="auto" height="40" />
      <h1 class="resetPassword__title">{{ $t('resetPassword.title') }}</h1>
      <div class="resetPassword__area">
        <p class="resetPassword__caption">{{ $t('resetPassword.caption') }}</p>
        <form @submit.prevent="clickSavePassword()">
          <dl class="resetPassword__inputArea">
            <dt class="resetPassword__inputTitle">
              {{ $t('resetPassword.password') }}<span>{{ $t('resetPassword.required') }}</span>
            </dt>
            <dd class="resetPassword__inputBlock">
              <input
                v-model="password"
                type="password"
                placeholder="password"
                :class="[
                  'resetPassword__inputText',
                  { inValid: isDirty.password && params.password.$anyInvalid },
                ]"
                @focus="resetInput('password')"
              />
              <Error
                v-if="
                  isDirty.password && params.password.$dirty && params.password.required.$invalid
                "
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
          <div class="resetPassword__inputButtonArea">
            <Error v-if="errorMessage !== ''" :message="errorMessage" type="total" />
            <button class="resetPassword__inputButton">
              {{ $t('resetPassword.button') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, useMeta } from '@nuxtjs/composition-api'
import { ActionKey } from '@/compositions/key/actionKey'
import { ActionStore } from '@/compositions/action'
import Loading from '@/components/Loading.vue'
import Logo from '@/components/shared/Logo.vue'
import Error from '@/components/shared/Error.vue'

export default defineComponent({
  components: {
    Logo,
    Error,
    Loading,
  },
  layout: 'Void',
  setup() {
    /** composition-api **/
    const { title, meta } = useMeta()
    /** /composition-api **/

    /** Inject **/
    const {
      password,
      mode,
      errorMessage,
      isInvalidError,
      isLoading,
      isDirty,
      params,
      switchMode,
      getPageTitle,
      clickSavePassword,
      resetInput,
    } = inject(ActionKey) as ActionStore
    /** /Inject **/

    /** LifeCycle **/
    onMounted(() => {
      // モードで判定してページを切り替えする関数呼び出し
      switchMode()
    })
    /** /LifeCycle **/

    /** Meta **/
    title.value = getPageTitle()
    meta.value = [
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
      { hid: 'robots', name: 'robots', content: 'noindex,nofollow,noarchive' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: `${getPageTitle()} | Pixage` },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '',
      },
      { hid: 'og:url', property: 'og:url', content: 'https://pixage.app/forgot-password-sendmail' },
      { hid: 'og:image', property: 'og:image', content: '/icon.png' },
    ]
    /** /Meta **/

    return {
      password,
      mode,
      errorMessage,
      isInvalidError,
      isLoading,
      isDirty,
      params,
      clickSavePassword,
      resetInput,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.action {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pc {
  .action {
    width: 500px;
    height: calc(100vh - 15px);
  }
}
.sp {
  .action {
    padding: 0 16px;
    width: 100%;
    min-height: 100vh;
  }
}

.invalidAction {
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
  .invalidAction {
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
  .invalidAction {
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

.verifyAccount {
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
  .verifyAccount {
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
  .verifyAccount {
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

.resetPassword {
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
  .resetPassword {
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
      &:hover {
        text-decoration: none;
      }
    }
  }
}
.sp {
  .resetPassword {
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
