import { ref, useRoute, useRouter } from '@nuxtjs/composition-api'
import firebase, { firestore } from '@/plugins/firebase'
import { CreatorType } from '@/types/creatorType'

const useUsers = () => {
  /** composition-api **/
  const router = useRouter()
  const route = useRoute()
  /** /composition-api **/

  // ユーザーuidの格納先
  const userUid = ref<string>('')

  // 削除するユーザーのサムネイルの格納先
  const picture = ref<string>('')

  // 削除するユーザーの表示名の格納先
  const displayName = ref<string>('')

  // 削除するユーザーのログイン方法の格納先
  const provider = ref<string>('')

  // 削除するユーザーのメールアドレスの格納先
  const email = ref<string>('')

  // 削除するユーザーの姓の格納先
  const firstName = ref<string>('')

  // 削除するユーザーの名の格納先
  const lastName = ref<string>('')

  // 削除するユーザーのクリエイター種別の格納先
  const isCreator = ref<CreatorType>('notCreator')

  // 削除するユーザーのコミッション活動中かの判定
  const isActive = ref<boolean>(false)

  // ユーザーデータの格納先
  const users = ref<firebase.firestore.DocumentData[]>([])

  // ユーザーの取得件数を格納
  const currentLimit = ref<number>(route.value.query.limit ? Number(route.value.query.limit) : 50)

  // ユーザーの並び替え条件を格納
  const currentDirection = ref<firebase.firestore.OrderByDirection>(
    route.value.query.direction ? 'asc' : 'desc'
  )

  // 現在のページを格納
  const currentPage = ref<number>(0)

  // ページ全体を格納
  const pages = ref<number[]>([])

  // ユーザーの初期呼び出し
  const initUsers = async () => {
    userUid.value = ''
    displayName.value = ''
    users.value = []
    pages.value = []
    currentPage.value = route.value.query.page ? Number(route.value.query.page) - 1 : 0
    const querySnapshot = await firestore
      .collection('usersPublicData')
      .orderBy('createdAt', currentDirection.value)
      .get()
    const limitPage = Math.ceil(querySnapshot.docs.length / currentLimit.value)
    if (Number(route.value.query.page) > limitPage) {
      currentPage.value = limitPage - 1
    }
    for (let i = 0; i < querySnapshot.docs.length / currentLimit.value; i++) {
      pages.value.push(i)
    }
    await firestore
      .collection('usersPublicData')
      .limit(currentLimit.value)
      .orderBy('createdAt', currentDirection.value)
      .startAt(querySnapshot.docs[currentLimit.value * currentPage.value])
      .get()
      .then((queryPublicSnapshot) => {
        queryPublicSnapshot.forEach((publicDoc) => {
          const publicData = publicDoc.data()
          firestore
            .doc(`usersSecretData/${publicDoc.id}`)
            .get()
            .then((secretDoc) => {
              const secretData = secretDoc.data()
              users.value.push(
                ...[
                  {
                    uid: publicDoc.id,
                    picture: publicData.picture,
                    displayName: publicData.displayName,
                    provider: secretData?.provider,
                    email: secretData?.email,
                    firstName: secretData?.firstName,
                    lastName: secretData?.lastName,
                    isCreator: publicData.isCreator,
                    isActive: publicData.isActive,
                    role: secretData?.role,
                  },
                ]
              )
            })
        })
      })
  }

  // 初期値の場合、パラメーターを削除する
  const deleteQuery = (key: string) => {
    const query = Object.assign({}, route.value.query)
    delete query[key]
    router.push({ query })
  }

  // ページ遷移
  const pageTransition = (page: number) => {
    if (page === currentPage.value) {
      return
    }
    const queryData = Object.assign({}, route.value.query)
    queryData.page = String(page + 1)
    page !== 0 ? router.push({ query: queryData }) : deleteQuery('page')
  }

  // 表示件数の切り替え
  const changeLimit = () => {
    const queryData = Object.assign({}, route.value.query)
    queryData.limit = String(currentLimit.value)
    currentLimit.value !== 50 ? router.push({ query: queryData }) : deleteQuery('limit')
  }

  // 並び順の切り替え
  const changeDirection = () => {
    const queryData = Object.assign({}, route.value.query)
    queryData.direction = String(currentDirection.value)
    currentDirection.value !== 'desc' ? router.push({ query: queryData }) : deleteQuery('direction')
  }

  return {
    userUid,
    picture,
    displayName,
    provider,
    email,
    firstName,
    lastName,
    isCreator,
    isActive,
    users,
    currentLimit,
    currentDirection,
    currentPage,
    pages,
    initUsers,
    pageTransition,
    changeLimit,
    changeDirection,
  }
}

export type UsersStore = ReturnType<typeof useUsers>
export { useUsers }
