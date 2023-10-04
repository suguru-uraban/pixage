import { ref, useContext } from '@nuxtjs/composition-api'
import { $cookiesOpt } from '@/plugins/cookie'
import { CommissionType } from '@/types/commissionType'

const useIndex = () => {
  /** composition-api **/
  const { app } = useContext()
  /** /composition-api **/

  // コミッション（漫画）が通信中かどうかの判定
  const processingCommissionComic = ref<boolean>(true)

  // コミッション（コスプレ）が通信中かどうかの判定
  const processingCommissionCosplay = ref<boolean>(true)

  // コミッション（アニメ）が通信中かどうかの判定
  const processingCommissionAnime = ref<boolean>(true)

  // コミッション（イラスト）が通信中かどうかの判定
  const processingCommissionIllust = ref<boolean>(true)

  // 作品一覧が通信中かどうかの判定
  const processingWorkList = ref<boolean>(true)

  // 現在のタブを格納
  const currentTab = ref<CommissionType>(
    app.$cookie.get('tabType')
      ? app.$cookie.get('tabType') === 'comic' ||
        app.$cookie.get('tabType') === 'illust' ||
        app.$cookie.get('tabType') === 'cosplay' ||
        app.$cookie.get('tabType') === 'anime'
        ? app.$cookie.get('tabType')
        : 'comic'
      : 'comic'
  )

  // トップ画面の通信を初期化
  const initIndexProcessing = () => {
    processingCommissionComic.value = true
    processingCommissionCosplay.value = true
    processingCommissionAnime.value = true
    processingCommissionIllust.value = true
    processingWorkList.value = true
  }

  // 作品一覧の通信を初期化
  const initWorksProcessing = () => {
    processingWorkList.value = true
  }

  // コミッション一覧の通信を初期化
  const initCommissionProcessing = (commissionType: string) => {
    if (commissionType === 'comic') {
      processingCommissionComic.value = true
    } else if (commissionType === 'illust') {
      processingCommissionIllust.value = true
    } else if (commissionType === 'cosplay') {
      processingCommissionCosplay.value = true
    } else {
      processingCommissionAnime.value = true
    }
  }

  // 通信完了
  const closeProcessing = (listType: string) => {
    setTimeout(() => {
      if (listType === 'comic') {
        processingCommissionComic.value = false
      } else if (listType === 'illust') {
        processingCommissionIllust.value = false
      } else if (listType === 'cosplay') {
        processingCommissionCosplay.value = false
      } else if (listType === 'anime') {
        processingCommissionAnime.value = false
      } else {
        processingWorkList.value = false
      }
    }, 500)
  }

  // タブの切り替え
  const changeTab = (commissionType: CommissionType) => {
    if (currentTab.value === commissionType) {
      return
    }
    app.$cookie.set('tabType', commissionType, $cookiesOpt)
    currentTab.value = app.$cookie.get('tabType')
  }

  return {
    processingCommissionComic,
    processingCommissionCosplay,
    processingCommissionAnime,
    processingCommissionIllust,
    processingWorkList,
    currentTab,
    initIndexProcessing,
    initWorksProcessing,
    initCommissionProcessing,
    closeProcessing,
    changeTab,
  }
}

export type IndexStore = ReturnType<typeof useIndex>
export { useIndex }
