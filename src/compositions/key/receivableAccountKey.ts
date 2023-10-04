import { InjectionKey } from '@nuxtjs/composition-api'
import { ReceivableAccountStore } from '@/compositions/receivableAccount'

export const ReceivableAccountKey: InjectionKey<ReceivableAccountStore> =
  Symbol('ReceivableAccountStore')
