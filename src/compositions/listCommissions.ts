import { ref } from '@nuxtjs/composition-api'
import firebase, { firestore } from '@/plugins/firebase'

const useListCommissions = () => {
  // コミッションリストデータの格納先
  const commissions = ref<firebase.firestore.DocumentData>([])

  // 現在の作品IDの格納先
  const currentWCommissionId = ref<number>(0)

  // 現在の作品タイトルの格納先
  const currentCommissionTitle = ref<string>('')

  // 作品リストを初期化
  const initListCommissions = () => {
    commissions.value = []
    firestore
      .collection('commissions')
      .orderBy('commissionId', 'desc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const tmp = doc.data()
          await firestore
            .collection('usersPublicData')
            .where('creatorId', '==', tmp.creatorId)
            .get()
            .then((publicSnapshot) => {
              publicSnapshot.forEach((publicDoc) => {
                tmp.picture = publicDoc.data().picture
                tmp.displayName = publicDoc.data().displayName
              })
            })
          const subDocRef = await doc.ref.collection('ja').doc('data').get()
          tmp.ja = subDocRef.data()
          commissions.value.push(...[tmp])
        })
      })
  }

  return {
    commissions,
    currentWCommissionId,
    currentCommissionTitle,
    initListCommissions,
  }
}

export type ListCommissionsStore = ReturnType<typeof useListCommissions>
export { useListCommissions }
