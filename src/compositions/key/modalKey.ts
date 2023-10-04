import { InjectionKey } from '@nuxtjs/composition-api'
import { ModalStore } from '@/compositions/modal'

export const ModalKey: InjectionKey<ModalStore> = Symbol('ModalStore')
