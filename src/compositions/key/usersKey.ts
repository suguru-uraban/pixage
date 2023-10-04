import { InjectionKey } from '@nuxtjs/composition-api'
import { UsersStore } from '@/compositions/users'

export const UsersKey: InjectionKey<UsersStore> = Symbol('UsersStore')
