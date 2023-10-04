import { InjectionKey } from '@nuxtjs/composition-api'
import { IndexStore } from '@/compositions/index'

export const IndexKey: InjectionKey<IndexStore> = Symbol('IndexStore')
