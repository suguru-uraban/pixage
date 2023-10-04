import { InjectionKey } from '@nuxtjs/composition-api'
import { EditCommissionStore } from '@/compositions/editCommission'

export const EditCommissionKey: InjectionKey<EditCommissionStore> = Symbol('EditCommissionStore')
