import { ref } from '@nuxtjs/composition-api'
import { firestore } from '@/plugins/firebase'

const useCount = () => {
  // 総ユーザー数の格納先
  const usersCount = ref<number>(0)

  // 総クリエイター数の格納先
  const creatorsCount = ref<number>(0)

  // 総作品数の格納先
  const worksCount = ref<number>(0)

  // 総コミッション数の格納先
  const commissionsCount = ref<number>(0)

  // 総ユーザー数を取得
  const getUsersCount = async () => {
    await firestore
      .doc('usersCount/global')
      .get()
      .then((doc) => {
        usersCount.value = doc.data()?.count ?? 0
      })
  }

  // 総クリエイター数を取得
  const getCreatorsCount = async () => {
    await firestore
      .doc('creatorsCount/global')
      .get()
      .then((doc) => {
        creatorsCount.value = doc.data()?.count ?? 0
      })
  }

  // 総作品数を取得
  const getWorksCount = async () => {
    await firestore
      .doc('worksCount/global')
      .get()
      .then((doc) => {
        worksCount.value = doc.data()?.count ?? 0
      })
  }

  // 総コミッション数を取得
  const getCommissionsCount = async () => {
    await firestore
      .doc('commissionsCount/global')
      .get()
      .then((doc) => {
        commissionsCount.value = doc.data()?.count ?? 0
      })
  }

  return {
    usersCount,
    creatorsCount,
    worksCount,
    commissionsCount,
    getUsersCount,
    getCreatorsCount,
    getWorksCount,
    getCommissionsCount,
  }
}

export type CountStore = ReturnType<typeof useCount>
export { useCount }
