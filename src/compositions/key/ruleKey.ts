import { InjectionKey } from '@nuxtjs/composition-api'
import { RuleStore } from '@/compositions/rule'

export const RuleKey: InjectionKey<RuleStore> = Symbol('RuleStore')
