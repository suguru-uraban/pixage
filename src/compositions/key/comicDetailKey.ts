import { InjectionKey } from '@nuxtjs/composition-api'
import { ComicDetailStore } from '@/compositions/comicDetail'

export const ComicDetailKey: InjectionKey<ComicDetailStore> = Symbol('ComicDetailStore')
