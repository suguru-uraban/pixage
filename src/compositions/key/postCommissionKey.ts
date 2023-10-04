import { InjectionKey } from '@nuxtjs/composition-api'
import { PostCommissionStore } from '@/compositions/postCommission'

export const PostCommissionKey: InjectionKey<PostCommissionStore> = Symbol('PostCommissionStore')
