import { reactive, ref, useContext, useRoute, useRouter } from '@nuxtjs/composition-api'
import { useValidation } from 'vue-composable'
import { auth } from '@/plugins/firebase'
import { useRule } from '@/compositions/rule'

const useAction = () => {
  /** composition-api **/
  const { app } = useContext()
  const router = useRouter()
  const route = useRoute()
  const { required, passwordFormat } = useRule()
  /** /composition-api **/

  // パスワードを格納
  const password = ref<string>('')

  // ページモードを格納
  const mode = ref(route.value.query.mode)

  // アクションコードを格納
  const actionCode = ref(route.value.query.oobCode)

  // エラーメッセージを格納
  const errorMessage = ref<string>('')

  // 無効なURLの判定
  const isInvalidError = ref<boolean>(false)

  // ローディング中かの判定
  const isLoading = ref<boolean>(true)

  // その項目を入力・変更したかの判定（バリデーションで使用）
  const isDirty = reactive({
    password: false,
  })

  // パスワード変更のバリデーション
  const params = useValidation({
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
  })

  // ページが有効かどうかを判定する
  const verifyAccount = (actionCode: string) => {
    auth
      .applyActionCode(actionCode)
      .then(() => {
        isLoading.value = false
      })
      .catch(() => {
        isInvalidError.value = true
        isLoading.value = false
      })
  }

  // モードで判定してページを切り替え
  const switchMode = () => {
    if (mode.value === 'verifyEmail') {
      verifyAccount(actionCode.value.toString())
    }
    if (mode.value === 'resetPassword') {
      auth
        .checkActionCode(actionCode.value.toString())
        .then(() => {
          isLoading.value = false
        })
        .catch(() => {
          isInvalidError.value = true
          isLoading.value = false
        })
    }
  }

  // ページタイトルを取得
  const getPageTitle = () => {
    if (isInvalidError.value) {
      return app.i18n.t('invalidAction.title').toString()
    } else if (!isInvalidError.value && mode.value === 'verifyEmail') {
      return app.i18n.t('verifyAccount.title').toString()
    } else if (!isInvalidError && mode.value === 'resetPassword') {
      return app.i18n.t('resetPassword.title').toString()
    }
  }

  // パスワードをリセットする
  const resetPassword = (actionCode: string, password: string) => {
    auth
      .verifyPasswordResetCode(actionCode)
      .then(() => {
        auth.confirmPasswordReset(actionCode, password).then(() => {
          router.push('/forgot-password-done')
        })
      })
      .catch(() => {
        isInvalidError.value = true
      })
  }

  // クリックしてパスワードをリセットする関数を呼び出し
  const clickSavePassword = async () => {
    if (!params.$anyInvalid || !actionCode.value) {
      resetPassword(actionCode.value.toString(), password.value)
    } else {
      if (params.password.$anyInvalid) isDirty.password = true
      return await params.$touch()
    }
  }

  // フォームをリセット
  const resetInput = (input: string) => {
    switch (input) {
      case 'password':
        params.password.$reset()
        isDirty.password = false
        errorMessage.value = ''
        break
    }
  }

  return {
    password,
    mode,
    errorMessage,
    isInvalidError,
    isLoading,
    isDirty,
    params,
    switchMode,
    getPageTitle,
    resetPassword,
    clickSavePassword,
    resetInput,
  }
}

export type ActionStore = ReturnType<typeof useAction>
export { useAction }
