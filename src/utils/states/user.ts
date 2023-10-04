import {
  provide,
  inject,
  InjectionKey,
  reactive,
  useContext,
  useAsync,
  toRefs,
  ref,
} from '@nuxtjs/composition-api'
import { auth, firestore } from '@/plugins/firebase'
import { $cookiesOptDelete } from '@/plugins/cookie'
import { getUserFromCookie } from '@/utils/cookieDecode'
import { RoleType } from '@/types/roleType'
import { CreatorType } from '@/types/creatorType'

export type UserType = {
  uid: string
  displayName: string
  picture: string
  isCreator: CreatorType
  isActive: boolean
  works: string[]
  creatorId: number
  firstName: string
  lastName: string
  email: string
  emailDomain: string
  provider: string
  availablePaidPoint: number
  availableFreePoint: number
  receivedPoint: number
  language: string
  role: RoleType
}

export type ErrorType = {
  state: number
  message: string
}
export type GlobalStateType = {
  user: UserType
  error?: ErrorType
}

export const useGlobalState = () => {
  const { app } = useContext()

  const processing = ref<boolean>(false)

  const globalUserState = reactive<UserType>({
    uid: '',
    displayName: '',
    picture: '',
    isCreator: 'notCreator',
    isActive: false,
    works: [],
    creatorId: 0,
    firstName: '',
    lastName: '',
    email: '',
    emailDomain: '',
    provider: '',
    availablePaidPoint: 0,
    availableFreePoint: 0,
    receivedPoint: 0,
    language: 'ja',
    role: 'guest',
  })

  const cleanUserData = () => {
    globalUserState.uid = ''
    globalUserState.displayName = ''
    globalUserState.picture = ''
    globalUserState.isCreator = 'notCreator'
    globalUserState.isActive = false
    globalUserState.works = []
    globalUserState.creatorId = 0
    globalUserState.firstName = ''
    globalUserState.lastName = ''
    globalUserState.email = ''
    globalUserState.emailDomain = ''
    globalUserState.provider = ''
    globalUserState.availablePaidPoint = 0
    globalUserState.availableFreePoint = 0
    globalUserState.receivedPoint = 0
    globalUserState.language = 'ja'
    globalUserState.role = 'guest'
  }

  const user = getUserFromCookie(app.$cookie.get('__session'))

  useAsync(async () => {
    if (app.$cookie.get('__session')) {
      processing.value = true
      firestore
        .doc(`usersPublicData/${user?.user_id}`)
        .get()
        .then((res) => {
          globalUserState.displayName =
            res && res.data()?.displayName ? res.data()?.displayName : ''
          globalUserState.picture = res && res.data()?.picture ? res.data()?.picture : ''
          globalUserState.isCreator =
            res && res.data()?.isCreator ? res.data()?.isCreator : 'notCreator'
          globalUserState.isActive = res && res.data()?.isActive ? res.data()?.isActive : false
          globalUserState.works = res && res.data()?.works ? res.data()?.works : []
          globalUserState.creatorId = res && res.data()?.creatorId ? res.data()?.creatorId : 0
          processing.value = false
        })
    } else {
      await auth.signOut()
      app.$cookie.set('__session', '', $cookiesOptDelete)
      cleanUserData()
    }
  })

  const getUsersSecretData = () => {
    firestore
      .doc(`usersSecretData/${user?.user_id}`)
      .get()
      .then((res) => {
        globalUserState.firstName = res && res.data()?.firstName ? res.data()?.firstName : ''
        globalUserState.lastName = res && res.data()?.lastName ? res.data()?.lastName : ''
        globalUserState.email = res && res.data()?.email ? res.data()?.email : ''
        globalUserState.emailDomain = res && res.data()?.email ? res.data()?.email.split('@') : ''
        globalUserState.provider = res && res.data()?.provider ? res.data()?.provider : ''
        globalUserState.availablePaidPoint =
          res && res.data()?.availablePaidPoint ? res.data()?.availablePaidPoint : 0
        globalUserState.availableFreePoint =
          res && res.data()?.availableFreePoint ? res.data()?.availableFreePoint : 0
        globalUserState.receivedPoint =
          res && res.data()?.receivedPoint ? res.data()?.receivedPoint : 0
        globalUserState.language = res && res.data()?.language ? res.data()?.language : 'ja'
        globalUserState.role = res && res.data()?.role ? res.data()?.role : 'guest'
      })
  }

  return {
    processing,
    ...toRefs(globalUserState),
    cleanUserData,
    getUsersSecretData,
  }
}

export type StateType = ReturnType<typeof useGlobalState>

export const GlobalStateKey: InjectionKey<StateType> = Symbol('GlobalState')
export const ErrorStateKey: InjectionKey<ErrorType> = Symbol('ErrorState')

export const provideGlobalState = () => {
  provide(GlobalStateKey, useGlobalState())
}

export const injectGlobalState = () => {
  const state = inject(GlobalStateKey)
  if (!state) {
    throw new Error('Unable to install User State')
  }
  return state
}
