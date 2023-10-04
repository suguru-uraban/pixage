import { InjectionKey } from '@nuxtjs/composition-api'
import { GuardStore } from '@/compositions/guard'

export const GuardKey: InjectionKey<GuardStore> = Symbol('GuardStore')
