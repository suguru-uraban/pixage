import { InjectionKey } from '@nuxtjs/composition-api'
import { CreatorSpaceStore } from '@/compositions/creatorSpace'

export const CreatorSpaceKey: InjectionKey<CreatorSpaceStore> = Symbol('CreatorSpaceStore')
