import { InjectionKey } from '@nuxtjs/composition-api'
import { BreadcrumbStore } from '@/compositions/breadcrumb'

export const BreadcrumbKey: InjectionKey<BreadcrumbStore> = Symbol('BreadcrumbStore')
