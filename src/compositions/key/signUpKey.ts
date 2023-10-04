import { InjectionKey } from '@nuxtjs/composition-api'
import { SignUpStore } from '@/compositions/signUp'

export const SignUpKey: InjectionKey<SignUpStore> = Symbol('SignUpStore')
