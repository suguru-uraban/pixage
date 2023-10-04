import { InjectionKey } from '@nuxtjs/composition-api'
import { DeleteUserStore } from '@/compositions/deleteUser'

export const DeleteUserKey: InjectionKey<DeleteUserStore> = Symbol('DeleteUserStore')
