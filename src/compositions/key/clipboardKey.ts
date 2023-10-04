import { InjectionKey } from '@nuxtjs/composition-api'
import { ClipboardStore } from '@/compositions/clipboard'

export const ClipboardKey: InjectionKey<ClipboardStore> = Symbol('ClipboardStore')
