import { ref } from '@nuxtjs/composition-api'

const useClipboard = () => {
  // コピーテキストを格納
  const copyText = ref<string>('')

  // コピーテキストを格納
  const currentEpisodeClipboard = ref<number>(0)

  // コピー成功
  const onCopy = () => {
    copyText.value = 'コピーしました'
    setTimeout(() => {
      copyText.value = ''
    }, 3000)
  }

  // コピー失敗
  const onError = () => {
    copyText.value = 'コピー失敗しました'
    setTimeout(() => {
      copyText.value = ''
    }, 3000)
  }

  return {
    copyText,
    currentEpisodeClipboard,
    onCopy,
    onError,
  }
}

export type ClipboardStore = ReturnType<typeof useClipboard>
export { useClipboard }
