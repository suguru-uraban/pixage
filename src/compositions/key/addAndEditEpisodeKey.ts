import { InjectionKey } from '@nuxtjs/composition-api'
import { AddAndEditEpisodeStore } from '@/compositions/addAndEditEpisode'

export const AddAndEditEpisodeKey: InjectionKey<AddAndEditEpisodeStore> =
  Symbol('AddAndEditEpisodeStore')
