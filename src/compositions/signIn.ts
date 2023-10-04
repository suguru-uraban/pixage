import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import firebase, { auth, firestore, provideTwitter, timestamp } from '@/plugins/firebase'
import {
  $cookiesOpt,
  $cookiesOptDelete,
  $cookiesOptMonthSecure,
  $cookiesOptSecure,
} from '@/plugins/cookie'
import { AuthError } from '@/types/authType'
import { getUserFromCookie } from '@/utils/cookieDecode'

const useSignIn = () => {
  const { app } = useContext()
  const router = useRouter()

  const errorMessage = ref<string>('')

  const loadingSignIn = ref<boolean>(app.$cookie.get('isTwitterSignIn'))

  const signIn = async (email: string, password: string, stayLoggedIn: boolean) => {
    try {
      await auth.signInWithEmailAndPassword(email, password)
      const token = await auth.currentUser?.getIdToken(true)
      stayLoggedIn
        ? app.$cookie.set('__session', token, $cookiesOptMonthSecure)
        : app.$cookie.set('__session', token, $cookiesOptSecure)
      app.$cookie.set('firstSession', true, $cookiesOpt)
      router.push('/')
    } catch (err) {
      const error = err as AuthError
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/email-already-in-use':
        case 'auth/wrong-password':
        case 'auth/user-mismatch':
          errorMessage.value = app.i18n.t('error.wrongPassword').toString()
          break
        case 'auth/too-many-requests':
          errorMessage.value = app.i18n.t('error.tooManyRequests').toString()
          break
        default:
          errorMessage.value = ''
      }
    }
  }

  const signInWithTwitter = () => {
    app.$cookie.set('isTwitterSignIn', true, $cookiesOpt)
    auth.signInWithRedirect(provideTwitter)
  }

  const redirectTwitterToSignIn = () => {
    if (app.$cookie.get('isTwitterSignIn')) {
      app.$cookie.set('isTwitterSignIn', false, $cookiesOptDelete)
      loadingSignIn.value = true
      auth.getRedirectResult().then((result) => {
        auth.updateCurrentUser(result.user)
      })
      auth.onAuthStateChanged(async (resultUser) => {
        if (resultUser) {
          const token = await auth.currentUser?.getIdToken(true)
          if (app.$cookie.get('stayLoggedInTwitter')) {
            app.$cookie.set('__session', token, $cookiesOptMonthSecure)
          } else {
            app.$cookie.set('__session', token, $cookiesOptSecure)
          }
          app.$cookie.set('firstSession', true, $cookiesOpt)
          const user = getUserFromCookie(app.$cookie.get('__session'))
          const batch = firestore.batch()
          const usersCountRef = firestore.doc(`usersCount/global`)
          const publicRef = firestore.doc(`usersPublicData/${user?.user_id}`)
          const secretRef = firestore.doc(`usersSecretData/${user?.user_id}`)
          const publicSnapshot = await publicRef.get()
          if (!publicSnapshot.exists) {
            batch.set(publicRef, {
              createdAt: timestamp,
              creatorId: 0,
              displayName: user?.name ? user?.name : '',
              isActive: false,
              isCreator: 'notCreator',
              picture: user?.picture ? user?.picture : '',
              updatedAt: timestamp,
            })
            batch.set(secretRef, {
              availableFreePoint: 0,
              availablePaidPoint: 0,
              createdAt: timestamp,
              email: '',
              emailDomain: '',
              firstName: '',
              language: 'ja',
              lastName: '',
              provider: user?.firebase.sign_in_provider ? user?.firebase.sign_in_provider : '',
              receivedPoint: 0,
              role: 'user',
              uid: user?.user_id ? user?.user_id : '',
              updatedAt: timestamp,
            })
            batch.update(usersCountRef, {
              count: firebase.firestore.FieldValue.increment(1),
              updatedAt: timestamp,
            })
            batch.commit().then(() => {
              app.$cookie.set('notAgreement', true, $cookiesOpt)
              router.push('/agreement_twitter_signin')
              if (app.$cookie.get('stayLoggedInTwitter')) {
                app.$cookie.set('stayLoggedInTwitter', false, $cookiesOptDelete)
              }
              // TODO: 一瞬だけログインページが見えるのを防ぎたい
              setTimeout(() => {
                loadingSignIn.value = false
              }, 50)
            })
          } else {
            router.push('/')
            if (app.$cookie.get('stayLoggedInTwitter')) {
              app.$cookie.set('stayLoggedInTwitter', false, $cookiesOptDelete)
            }
            // TODO: 一瞬だけログインページが見えるのを防ぎたい
            setTimeout(() => {
              loadingSignIn.value = false
            }, 50)
          }
        }
      })
    }
  }

  return {
    errorMessage,
    loadingSignIn,
    signIn,
    signInWithTwitter,
    redirectTwitterToSignIn,
  }
}

export type SignInStore = ReturnType<typeof useSignIn>
export { useSignIn }
