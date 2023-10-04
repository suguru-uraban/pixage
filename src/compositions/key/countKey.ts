import { InjectionKey } from '@nuxtjs/composition-api'
import { CountStore } from '@/compositions/count'

export const CountKey: InjectionKey<CountStore> = Symbol('CountStore')
