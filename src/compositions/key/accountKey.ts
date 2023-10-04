import { InjectionKey } from '@nuxtjs/composition-api'
import { AccountStore } from '@/compositions/account'

export const AccountKey: InjectionKey<AccountStore> = Symbol('AccountStore')
