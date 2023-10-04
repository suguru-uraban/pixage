import { InjectionKey } from '@nuxtjs/composition-api'
import { ForgotPasswordStore } from '@/compositions/forgotPassword'

export const ForgotPasswordKey: InjectionKey<ForgotPasswordStore> = Symbol('ForgotPasswordStore')
