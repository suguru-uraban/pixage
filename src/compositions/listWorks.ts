import { ref } from '@nuxtjs/composition-api'
import firebase, { firestore } from '@/plugins/firebase'

const useListWorks = () => {
  // 作品リストデータの格納先
  const works = ref<firebase.firestore.DocumentData>([])

  // 現在の作品IDの格納先
  const currentWorkId = ref<number>(0)

  // 現在の作品タイトルの格納先
  const currentWorkTitle = ref<string>('')

  // 作品リストを初期化
  const initListWorks = () => {
    works.value = []
    firestore
      .collection('works')
      .orderBy('workId', 'desc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const tmp = doc.data()
          const subDocRef = await doc.ref.collection('ja').doc('data').get()
          tmp.ja = subDocRef.data()
          works.value.push(...[tmp])
        })
      })
  }

  return {
    works,
    currentWorkId,
    currentWorkTitle,
    initListWorks,
  }
}

export type ListWorksStore = ReturnType<typeof useListWorks>
export { useListWorks }
