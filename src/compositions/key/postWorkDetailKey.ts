import { InjectionKey } from '@nuxtjs/composition-api'
import { PostWorkDetailStore } from '@/compositions/postWorkDetail'

export const PostWorkDetailKey: InjectionKey<PostWorkDetailStore> = Symbol('PostWorkDetailStore')
