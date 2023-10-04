import { InjectionKey } from '@nuxtjs/composition-api'
import { AddAndEditWorkStore } from '@/compositions/addAndEditWork'

export const AddAndEditWorkKey: InjectionKey<AddAndEditWorkStore> = Symbol('AddAndEditWorkStore')
