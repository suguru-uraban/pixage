import { ref, useContext } from '@nuxtjs/composition-api'
import { getUserFromCookie } from '@/utils/cookieDecode'

const useAccount = () => {
  /** composition-api **/
  const { app } = useContext()
  /** /composition-api **/

  // ログインのcookieを格納
  const isAccountSignIn = ref<string>(app.$cookie.get('__session'))

  // ヘッダーアカウントメニューを開いたかどうかの判定
  const isOpenAccountMenu = ref<boolean>(false)

  // 認証しているかどうかを判定する
  const isVerified = () => {
    if (getUserFromCookie(isAccountSignIn.value) !== undefined) {
      if (getUserFromCookie(isAccountSignIn.value)?.firebase.sign_in_provider === 'password') {
        return getUserFromCookie(isAccountSignIn.value)?.email_verified ?? false
      }
      return true
    }
    return false
  }

  // ヘッダーアカウントメニューの開閉
  const handleOpenAccountMenu = () => {
    isOpenAccountMenu.value = !isOpenAccountMenu.value
  }

  return {
    isAccountSignIn,
    isOpenAccountMenu,
    isVerified,
    handleOpenAccountMenu,
  }
}

export type AccountStore = ReturnType<typeof useAccount>
export { useAccount }
