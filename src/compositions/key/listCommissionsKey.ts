import { InjectionKey } from '@nuxtjs/composition-api'
import { ListCommissionsStore } from '@/compositions/listCommissions'

export const ListCommissionsKey: InjectionKey<ListCommissionsStore> = Symbol('ListCommissionsStore')
