import { ref, useContext } from '@nuxtjs/composition-api'
import { firestore } from '@/plugins/firebase'
import { useAccount } from '@/compositions/account'
import { getUserFromCookie } from '@/utils/cookieDecode'

const useGuard = () => {
  const { app, from, redirect } = useContext()

  const guardLoading = ref<boolean>(false)

  const { isAccountSignIn } = useAccount()

  const routeGuard = () => {
    if (from.value === undefined) {
      redirect('/')
    }
  }
  const alreadyLoggedGuard = () => {
    if (isAccountSignIn.value !== undefined) {
      redirect('/')
    }
  }
  const notLoginGuard = () => {
    if (isAccountSignIn.value === undefined) {
      redirect('/signin')
    }
  }
  const roleGuard = () => {
    guardLoading.value = true
    const user = getUserFromCookie(app.$cookie.get('__session'))
    firestore
      .doc(`usersSecretData/${user?.user_id}`)
      .get()
      .then((res) => {
        if (
          res.data()?.role === 'user' ||
          res.data()?.role === 'guest' ||
          res.data()?.role === undefined
        ) {
          redirect('/')
        }
        setTimeout(() => {
          guardLoading.value = false
        }, 50)
      })
  }

  return {
    guardLoading,
    routeGuard,
    alreadyLoggedGuard,
    notLoginGuard,
    roleGuard,
  }
}

export type GuardStore = ReturnType<typeof useGuard>
export { useGuard }
