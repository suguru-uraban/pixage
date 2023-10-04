import { ref, SetupContext } from '@nuxtjs/composition-api'
import firebase, { firestore, timestamp } from '@/plugins/firebase'
import { CreatorType } from '@/types/creatorType'

const useAddAndEditCreator = () => {
  // クリエイター区分の定数
  const CREATOR_TYPES = [
    {
      type: 'all',
      display: '全作業可',
      displayTranslation: 'addAndEditCreator.all',
    },
    {
      type: 'storyOnly',
      display: '原作のみ',
      displayTranslation: 'addAndEditCreator.storyOnly',
    },
    {
      type: 'drawingOnly',
      display: '作画のみ',
      displayTranslation: 'addAndEditCreator.drawingOnly',
    },
  ]

  // クリエイター区分の定数
  const CREATOR_COMMISSION_TYPES = [
    {
      type: 'commissionOnly',
      display: 'コミッション活動のみ',
      displayTranslation: 'addAndEditCreator.commissionOnly',
    },
  ]

  // クリエイター編集時の通信中か否かの判定
  const processing = ref<boolean>(false)

  // 変更後のクリエイター区分の格納先
  const creatorType = ref<CreatorType>('notCreator')

  // 変更前のクリエイター区分の格納先
  const prevCreatorType = ref<CreatorType>('notCreator')

  // 活動中・活動休止中の判定
  const isActive = ref<boolean>(false)

  // クリエイター区分と活動中・活動休止中を初期化
  const initCreatorTypeAndIsActive = (uid: string) => {
    if (uid) {
      processing.value = true
      firestore
        .doc(`usersPublicData/${uid}`)
        .get()
        .then((doc) => {
          creatorType.value = doc.data()?.isCreator
          prevCreatorType.value = doc.data()?.isCreator
          isActive.value = doc.data()?.isActive
          processing.value = false
        })
    }
  }

  // 変更できないクリエイター区分
  const disableChangeCreator = (creatorType: string) => {
    if (prevCreatorType.value === 'all') {
      return !!(
        creatorType === 'storyOnly' ||
        creatorType === 'drawingOnly' ||
        creatorType === 'commissionOnly'
      )
    } else if (prevCreatorType.value === 'storyOnly') {
      return !!(creatorType === 'drawingOnly' || creatorType === 'commissionOnly')
    } else if (prevCreatorType.value === 'drawingOnly') {
      return !!(creatorType === 'storyOnly' || creatorType === 'commissionOnly')
    } else {
      return false
    }
  }

  // クリエイターの変更
  const handleChangeCreatorType = (value: CreatorType) => {
    creatorType.value = value
  }

  // 活動中・活動休止中の切り替え
  const handleChangeActive = (value: boolean) => {
    isActive.value = value
  }

  // クリエイターの変更
  const commitCreatorTypeAndIsActive = async (uid: string, ctx: SetupContext) => {
    let prevSerialNumber = 0
    const batch = firestore.batch()
    const creatorsCount = firestore.doc(`creatorsCount/global`)
    const publicRef = firestore.doc(`usersPublicData/${uid}`)
    await creatorsCount.get().then((doc) => {
      prevSerialNumber = doc.data()?.serialNumber
    })
    try {
      if (prevCreatorType.value === 'notCreator') {
        batch.update(creatorsCount, {
          serialNumber: firebase.firestore.FieldValue.increment(1),
          count: firebase.firestore.FieldValue.increment(1),
          updatedAt: timestamp,
        })
        batch.update(publicRef, {
          isCreator: creatorType.value,
          isActive: isActive.value,
          creatorId: prevSerialNumber + 1,
          updatedAt: timestamp,
        })
      } else {
        batch.update(publicRef, {
          isCreator: creatorType.value,
          isActive: isActive.value,
          updatedAt: timestamp,
        })
      }
      batch.commit().then(() => {
        ctx.emit('reload')
        initCreatorTypeAndIsActive(uid)
      })
    } catch (err) {
      // TODO: エラーが発見され次第対応を考える
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  return {
    CREATOR_TYPES,
    CREATOR_COMMISSION_TYPES,
    processing,
    creatorType,
    isActive,
    initCreatorTypeAndIsActive,
    disableChangeCreator,
    handleChangeCreatorType,
    handleChangeActive,
    commitCreatorTypeAndIsActive,
  }
}

export type AddAndEditCreatorStore = ReturnType<typeof useAddAndEditCreator>
export { useAddAndEditCreator }
