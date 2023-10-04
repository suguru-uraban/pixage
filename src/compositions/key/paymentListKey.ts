import { InjectionKey } from '@nuxtjs/composition-api'
import { PaymentListStore } from '@/compositions/paymentList'

export const PaymentListKey: InjectionKey<PaymentListStore> = Symbol('PaymentListStore')
