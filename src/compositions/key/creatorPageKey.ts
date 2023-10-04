import { InjectionKey } from '@nuxtjs/composition-api'
import { CreatorPageStore } from '@/compositions/creatorPage'

export const CreatorPageKey: InjectionKey<CreatorPageStore> = Symbol('CreatorPageStore')
