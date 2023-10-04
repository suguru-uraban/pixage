import { ref } from '@nuxtjs/composition-api'
import { ModalType } from '@/types/modalType'

const useModal = () => {
  const modalType = ref<ModalType>('noModal')

  const handleOpenModal = (modal: ModalType) => {
    modalType.value = modal
  }

  return {
    modalType,
    handleOpenModal,
  }
}

export type ModalStore = ReturnType<typeof useModal>
export { useModal }
