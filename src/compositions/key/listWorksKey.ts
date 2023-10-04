import { InjectionKey } from '@nuxtjs/composition-api'
import { ListWorksStore } from '@/compositions/listWorks'

export const ListWorksKey: InjectionKey<ListWorksStore> = Symbol('ListWorksStore')
