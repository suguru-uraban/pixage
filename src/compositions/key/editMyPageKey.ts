import { InjectionKey } from '@nuxtjs/composition-api'
import { EditMyPageStore } from '@/compositions/editMyPage'

export const EditMyPageKey: InjectionKey<EditMyPageStore> = Symbol('EditMyPageStore')
