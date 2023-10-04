import { InjectionKey } from '@nuxtjs/composition-api'
import { PrStore } from '@/compositions/pr'

export const PrKey: InjectionKey<PrStore> = Symbol('PrStore')
