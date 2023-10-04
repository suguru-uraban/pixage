import { InjectionKey } from '@nuxtjs/composition-api'
import { FlushStore } from '@/compositions/flush'

export const FlushKey: InjectionKey<FlushStore> = Symbol('FlushStore')
