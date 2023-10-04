import { ref } from '@nuxtjs/composition-api'

const useMenu = () => {
  const isOpenMenu = ref<boolean>(false)
  const handleOpenMenu = () => {
    isOpenMenu.value = !isOpenMenu.value
  }

  return {
    isOpenMenu,
    handleOpenMenu,
  }
}

export type MenuStore = ReturnType<typeof useMenu>
export { useMenu }
