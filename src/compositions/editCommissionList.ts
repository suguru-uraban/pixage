import { ref } from '@nuxtjs/composition-api'
import firebase, { firestore } from '@/plugins/firebase'

const useEditCommissionList = () => {
  // 自分のコミッションリリストの格納先
  const myCommissions = ref<firebase.firestore.DocumentData[]>([])

  // 現在のコミッションIDを取得
  const currentCommissionId = ref<number>(0)

  // 現在のコミッションタイトルを取得
  const currentCommissionTitle = ref<string>('')

  // 自分のコミッションリストを初期化
  const initEditCommissionList = (creatorId: number) => {
    myCommissions.value = []
    let loopCount = 1
    firestore
      .collection('commissions')
      .where('creatorId', '==', creatorId)
      .get()
      .then((commissionsSnapshot) => {
        if (!commissionsSnapshot.empty) {
          commissionsSnapshot.forEach(async (commissionsDoc) => {
            const commissionId = commissionsDoc.data().commissionId
            const langDataDoc = await commissionsDoc.ref.collection('ja').doc('data').get()
            myCommissions.value.push({
              commissionId,
              uid: langDataDoc.data()?.uid,
              commissionTitle: langDataDoc.data()?.commissionTitle,
              approval: commissionsDoc.data()?.approval,
              release: commissionsDoc.data()?.release,
            })
            if (commissionsSnapshot.size === loopCount) {
              myCommissions.value.sort((a, b) => {
                if (a.workId > b.workId) return 1
                if (a.workId < b.workId) return -1
                return 0
              })
            }
            loopCount += 1
          })
        }
      })
  }

  return {
    myCommissions,
    currentCommissionId,
    currentCommissionTitle,
    initEditCommissionList,
  }
}

export type EditCommissionListStore = ReturnType<typeof useEditCommissionList>
export { useEditCommissionList }
