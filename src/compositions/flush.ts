import { ref, useContext } from '@nuxtjs/composition-api'

const useFlush = () => {
  /** composition-api **/
  const { app } = useContext()
  /** /composition-api **/

  // flushの種類
  const flushType = ref<string>('')

  // flushに表示する文言
  const flushCaption = ref<string>('')

  // flushの表示非表示の判定
  const isShowFlush = ref<boolean>(false)

  // flush表示の際の種類と文言を事前に用意
  const flushObject = {
    verifyError: {
      type: 'error',
      caption: app.i18n.t('flush.verifyError').toString(), // TODO Flush表示時に言語を切り替えてもFlush内は切り替わらず
    },
    verifySuccess: {
      type: ' success',
      caption: app.i18n.t('flush.verifySuccess').toString(),
    },
    signOutError: {
      type: 'error',
      caption: app.i18n.t('flush.signOutError').toString(),
    },
    resetPasswordSuccess: {
      type: 'success',
      caption: app.i18n.t('flush.resetPasswordSuccess').toString(),
    },
  }

  // flushを非表示にする
  const hideFlush = () => {
    flushType.value = ''
    flushCaption.value = ''
    isShowFlush.value = false
  }

  return {
    flushType,
    flushCaption,
    isShowFlush,
    flushObject,
    hideFlush,
  }
}

export type FlushStore = ReturnType<typeof useFlush>
export { useFlush }
