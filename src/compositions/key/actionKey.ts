import { InjectionKey } from '@nuxtjs/composition-api'
import { ActionStore } from '@/compositions/action'

export const ActionKey: InjectionKey<ActionStore> = Symbol('ActionStore')
