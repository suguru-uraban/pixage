import { InjectionKey } from '@nuxtjs/composition-api'
import { CommissionReleaseStore } from '@/compositions/commissionRelease'

export const CommissionReleaseKey: InjectionKey<CommissionReleaseStore> =
  Symbol('CommissionReleaseStore')
