import { InjectionKey } from '@nuxtjs/composition-api'
import { ApprovalStore } from '@/compositions/approval'

export const ApprovalKey: InjectionKey<ApprovalStore> = Symbol('ApprovalStore')
