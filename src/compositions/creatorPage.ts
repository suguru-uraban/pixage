import { ref, useContext } from '@nuxtjs/composition-api'
import firebase, { firestore } from '@/plugins/firebase'
import { CreatorType } from '@/types/creatorType'

const useCreatorPage = () => {
  /** composition-api **/
  const { app } = useContext()
  /** /composition-api **/

  // 通信中かどうかの判定
  const processing = ref<boolean>(false)

  // 表示名の格納先
  const displayName = ref<string>('')

  // サムネイルファイルURLの格納先
  const picture = ref<string>('')

  // クリエイター種別の格納先
  const isCreator = ref<CreatorType>('all')

  // コミッション活動中かの判定
  const isActive = ref<boolean>(false)

  // PRの格納先
  const pr = ref<string>('')

  // 作品リストを格納
  const works = ref<firebase.firestore.DocumentData>([])

  // コミッションリストを格納
  const commissions = ref<firebase.firestore.DocumentData>([])

  // クリエイターデータの初期化
  const initCreator = (creatorId: string) => {
    processing.value = true
    displayName.value = ''
    picture.value = ''
    isCreator.value = 'all'
    isActive.value = false
    pr.value = ''
    works.value.length = 0
    commissions.value.length = 0
    firestore
      .collection('usersPublicData')
      .where('creatorId', '!=', 0)
      .where('creatorId', '==', Number(creatorId))
      .get()
      .then((creatorSnapshot) => {
        creatorSnapshot.forEach(async (doc) => {
          const tmp = doc.data()
          const subDocRef = await doc.ref.collection('creator').doc('pr').get()
          displayName.value = tmp.displayName
          picture.value = tmp.picture
          isCreator.value = tmp.isCreator
          isActive.value = tmp.isActive
          pr.value = subDocRef.data()?.pr ? subDocRef.data()?.pr : ''
          firestore
            .collection('works')
            .where('searchCreatorId', 'array-contains', Number(creatorId))
            .get()
            .then((workSnapshot) => {
              if (!workSnapshot.empty) {
                workSnapshot.forEach(async (workDoc) => {
                  const workTmp = workDoc.data()
                  const subDocRef = await workDoc.ref.collection('ja').doc('data').get()
                  workTmp.ja = subDocRef.data()
                  works.value.push(workTmp)
                })
              }
            })
          firestore
            .collection('commissions')
            .where('creatorId', '==', Number(creatorId))
            .get()
            .then((commissionSnapshot) => {
              if (!commissionSnapshot.empty) {
                commissionSnapshot.forEach(async (commissionDoc) => {
                  const commissionTmp = commissionDoc.data()
                  const subDocRef = await commissionDoc.ref.collection('ja').doc('data').get()
                  commissionTmp.ja = subDocRef.data()
                  commissions.value.push(commissionTmp)
                  processing.value = false
                })
              } else {
                processing.value = false
              }
            })
        })
      })
  }

  // クリエイターorユーザー、クリエイターの場合は区分も表示
  const viewIsCreator = (isCreator: CreatorType, isActive: boolean) => {
    if (isCreator === 'notCreator') {
      return app.i18n.t('creatorPage.user')
    } else if (isActive) {
      if (isCreator === 'all') {
        return app.i18n.t('creatorPage.inActivityAll')
      } else if (isCreator === 'storyOnly') {
        return app.i18n.t('creatorPage.inActivityStory')
      } else if (isCreator === 'drawingOnly') {
        return app.i18n.t('creatorPage.inActivityDrawing')
      } else if (isCreator === 'commissionOnly') {
        return app.i18n.t('creatorPage.inActivityCommission')
      }
    } else if (isCreator === 'all') {
      return app.i18n.t('creatorPage.inactiveAll')
    } else if (isCreator === 'storyOnly') {
      return app.i18n.t('creatorPage.inactiveStory')
    } else if (isCreator === 'drawingOnly') {
      return app.i18n.t('creatorPage.inactiveDrawing')
    } else if (isCreator === 'commissionOnly') {
      return app.i18n.t('creatorPage.inactiveCommission')
    }
  }

  return {
    processing,
    displayName,
    picture,
    isCreator,
    isActive,
    pr,
    works,
    commissions,
    initCreator,
    viewIsCreator,
  }
}

export type CreatorPageStore = ReturnType<typeof useCreatorPage>
export { useCreatorPage }
