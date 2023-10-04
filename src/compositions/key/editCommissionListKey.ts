import { InjectionKey } from '@nuxtjs/composition-api'
import { EditCommissionListStore } from '@/compositions/editCommissionList'

export const EditCommissionListKey: InjectionKey<EditCommissionListStore> =
  Symbol('EditCommissionListStore')
