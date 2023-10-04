import { InjectionKey } from '@nuxtjs/composition-api'
import { InquiryStore } from '@/compositions/inquiry'

export const InquiryKey: InjectionKey<InquiryStore> = Symbol('InquiryStore')
