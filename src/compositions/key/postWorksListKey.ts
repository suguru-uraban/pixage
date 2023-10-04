import { InjectionKey } from '@nuxtjs/composition-api'
import { PostWorksListStore } from '@/compositions/postWorksList'

export const PostWorksListKey: InjectionKey<PostWorksListStore> = Symbol('PostWorksListStore')
