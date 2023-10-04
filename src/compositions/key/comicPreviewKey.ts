import { InjectionKey } from '@nuxtjs/composition-api'
import { ComicPreviewStore } from '@/compositions/comicPreview'

export const ComicPreviewKey: InjectionKey<ComicPreviewStore> = Symbol('ComicPreviewStore')
