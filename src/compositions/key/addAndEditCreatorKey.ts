import { InjectionKey } from '@nuxtjs/composition-api'
import { AddAndEditCreatorStore } from '@/compositions/addAndEditCreator'

export const AddAndEditCreatorKey: InjectionKey<AddAndEditCreatorStore> =
  Symbol('AddAndEditCreatorStore')
