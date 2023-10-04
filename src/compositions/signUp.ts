import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import firebase, { auth, firestore, timestamp } from '@/plugins/firebase'
import { $cookiesOpt, $cookiesOptDelete, $cookiesOptSecure } from '@/plugins/cookie'
import { getUserFromCookie } from '@/utils/cookieDecode'
import { AuthError } from '@/types/authType'
import { injectGlobalState } from '@/utils/states/user'

const useSignUp = () => {
  const { app } = useContext()
  const router = useRouter()

  const state = injectGlobalState()

  const errorMessage = ref<string>('')

  const signUp = async (displayName: string, email: string, password: string) => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)
      const token = await auth.currentUser?.getIdToken(true)
      app.$cookie.set('__session', token, $cookiesOptSecure)
      app.$cookie.set('firstSession', true, $cookiesOpt)
      const user = getUserFromCookie(app.$cookie.get('__session'))
      const batch = firestore.batch()
      const usersCountRef = firestore.doc(`usersCount/global`)
      const publicRef = firestore.doc(`usersPublicData/${user?.user_id}`)
      const secretRef = firestore.doc(`usersSecretData/${user?.user_id}`)
      batch.set(publicRef, {
        createdAt: timestamp,
        creatorId: 0,
        displayName,
        isActive: false,
        isCreator: 'notCreator',
        picture: '',
        updatedAt: timestamp,
      })
      batch.set(secretRef, {
        availableFreePoint: 0,
        availablePaidPoint: 0,
        createdAt: timestamp,
        email: user?.email ? user?.email : '',
        emailDomain: user?.email ? user?.email.split('@')[1] : '',
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
        if (!user?.email_verified) {
          res.user
            ?.updateProfile({
              displayName,
            })
            .then(async () => {
              res.user?.sendEmailVerification()
              await auth.signOut()
              app.$cookie.set('__session', '', $cookiesOptDelete)
              state.cleanUserData()
              router.push('/verify-sendmail')
            })
        } else {
          router.push('/')
        }
      })
    } catch (err) {
      const error = err as AuthError
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage.value = app.i18n.t('error.emailAlreadyInUse').toString()
          break
        default:
          errorMessage.value = ''
      }
    }
  }

  return {
    errorMessage,
    signUp,
  }
}

export type SignUpStore = ReturnType<typeof useSignUp>
export { useSignUp }
