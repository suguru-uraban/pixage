import { ref } from '@nuxtjs/composition-api'

const useSearch = () => {
  const isOpenSearchMenu = ref<boolean>(false)
  const handleOpenSearchMenu = () => {
    isOpenSearchMenu.value = !isOpenSearchMenu.value
  }

  return {
    isOpenSearchMenu,
    handleOpenSearchMenu,
  }
}

export { useSearch }
