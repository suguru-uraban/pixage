import { InjectionKey } from '@nuxtjs/composition-api'
import { MenuStore } from '@/compositions/menu'

export const MenuKey: InjectionKey<MenuStore> = Symbol('MenuStore')
