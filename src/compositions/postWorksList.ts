import { ref } from '@nuxtjs/composition-api'
import firebase, { firestore } from '@/plugins/firebase'

const usePostWorksList = () => {
  // 投稿データの格納先
  const postWorks = ref<firebase.firestore.DocumentData[]>([])

  // ダウンロードログの格納先
  const downloadLog = ref<firebase.firestore.DocumentData[]>([])

  // 削除ログの格納先
  const deleteLog = ref<firebase.firestore.DocumentData[]>([])

  // ユーザーの初期呼び出し
  const initPostWorks = () => {
    postWorks.value = []
    firestore
      .collection('postWork')
      .get()
      .then((snapshot) => {
        snapshot.forEach(async (doc) => {
          const tmp = doc.data()
          const downloadCollection = await doc.ref.collection('download').get()
          if (!downloadCollection.empty) {
            downloadCollection.forEach((downloadDoc) => {
              tmp.download = downloadDoc.data()
            })
          }
          const deleteCollection = await doc.ref.collection('delete').get()
          if (!deleteCollection.empty) {
            deleteCollection.forEach((deleteDoc) => {
              tmp.delete = deleteDoc.data()
            })
          }
          postWorks.value.push(
            ...[
              {
                uid: tmp.uid,
                workTitle: tmp.workTitle,
                episodeNum: tmp.episodeNum,
                episodeTitle: tmp.episodeTitle,
                displayName: tmp.displayName,
                downloadCheck: tmp.download,
                deleteCheck: tmp.delete,
              },
            ]
          )
        })
      })
  }

  return {
    postWorks,
    downloadLog,
    deleteLog,
    initPostWorks,
  }
}

export type PostWorksListStore = ReturnType<typeof usePostWorksList>
export { usePostWorksList }
