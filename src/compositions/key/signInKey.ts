import { InjectionKey } from '@nuxtjs/composition-api'
import { SignInStore } from '@/compositions/signIn'

export const SignInKey: InjectionKey<SignInStore> = Symbol('SignInStore')
