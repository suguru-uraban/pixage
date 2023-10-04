import { InjectionKey } from '@nuxtjs/composition-api'
import { ReleaseStore } from '@/compositions/release'

export const ReleaseKey: InjectionKey<ReleaseStore> = Symbol('ReleaseStore')
