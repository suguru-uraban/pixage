import { InjectionKey } from '@nuxtjs/composition-api'
import { SalesConfirmWorkStore } from '@/compositions/salesConfirmWork'

export const SalesConfirmWorkKey: InjectionKey<SalesConfirmWorkStore> =
  Symbol('SalesConfirmWorkStore')
