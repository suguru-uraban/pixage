import { InjectionKey } from '@nuxtjs/composition-api'
import { ListStore } from '@/compositions/list'

export const ListKey: InjectionKey<ListStore> = Symbol('ListStore')
