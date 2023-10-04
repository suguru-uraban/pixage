import { InjectionKey } from '@nuxtjs/composition-api'
import { CommissionDetailStore } from '@/compositions/commissionDetail'

export const CommissionDetailKey: InjectionKey<CommissionDetailStore> =
  Symbol('CommissionDetailStore')
