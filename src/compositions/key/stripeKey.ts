import { InjectionKey } from '@nuxtjs/composition-api'
import { StripeStore } from '@/compositions/stripe'

export const StripeKey: InjectionKey<StripeStore> = Symbol('StripeStore')
