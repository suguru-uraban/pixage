import { InjectionKey } from '@nuxtjs/composition-api'
import { PostWorkStore } from '@/compositions/postWork'

export const PostWorkKey: InjectionKey<PostWorkStore> = Symbol('PostWorkStore')
