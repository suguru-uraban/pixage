import { ref, useContext } from '@nuxtjs/composition-api'
import { firestore } from '@/plugins/firebase'
import { getUserFromCookie } from '@/utils/cookieDecode'

const useCommissionDetail = () => {
  /** composition-api **/
  const { app } = useContext()
  /** /composition-api **/

  // 現在のユーザーをcookieから取得
  const user = getUserFromCookie(app.$cookie.get('__session'))

  // UIDを格納
  const uid = ref<string>('')

  // 通信中かどうかの判定
  const processing = ref<boolean>(true)

  // 自分のクリエイターIDを格納
  const myCreatorId = ref<number>(0)

  // コミッションIDを格納
  const commissionId = ref<number>(0)

  // コミッションのクリエイターIDを格納
  const creatorId = ref<number>(0)

  // 活動中かどうかの判定
  const isActive = ref<boolean>(false)

  // 承認・非承認の判定
  const approval = ref<boolean>(false)

  // 公開・非公開の判定
  const release = ref<boolean>(false)

  // ユーザーサムネイルを格納
  const picture = ref<string>('')

  // コミッションタイトルを格納
  const commissionTitle = ref<string>('')

  // コミッションの概要を格納
  const commissionDescription = ref<string>('')

  // コミッションの種類を格納
  const commissionType = ref<string>('')

  // コミッションの金額を格納
  const commissionPrice = ref<string>('')

  // 通貨を格納
  const currency = ref<string>('')

  // 納期を格納
  const workPeriod = ref<number>(0)

  // 表示名を入力
  const displayName = ref<string>('')

  // リクエスト数を格納
  const requestCount = ref<number>(0)

  // お気に入り数を格納
  const favorite = ref<number>(0)

  // いいね数を格納
  const like = ref<number>(0)

  // 作例を格納
  const images = ref<string[]>([])

  // 言語の格納先
  const lang = ref<string>('')

  // 現在のコミッションIDを取得
  const currentCommissionId = ref<number>(0)

  // 現在のコミッションタイトルを取得
  const currentCommissionTitle = ref<string>('')

  // 作例画像を格納
  const sampleImage = ref<string>('')

  // コミッション詳細を初期化
  const initCommissionDetail = async (id: string) => {
    processing.value = true
    picture.value = ''
    commissionTitle.value = ''
    if (id !== undefined) {
      await firestore
        .collection('usersPublicData')
        .doc(user?.user_id)
        .get()
        .then((publicDoc) => {
          myCreatorId.value = publicDoc.data()?.creatorId
        })
      firestore
        .collection('commissions')
        .where('commissionId', '==', Number(id))
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            uid.value = doc.id
            const tmp = doc.data()
            const langData = doc.ref.collection('ja').id
            const subDocRef = await doc.ref.collection('ja').doc('data').get()
            tmp.ja = subDocRef.data()
            commissionId.value = tmp.commissionId
            creatorId.value = tmp.creatorId
            approval.value = tmp.approval
            release.value = tmp.release
            commissionTitle.value = tmp.ja.commissionTitle
            commissionDescription.value = tmp.ja.commissionDescription
            commissionType.value = tmp.commissionType
            commissionPrice.value = tmp.ja.commissionPrice.toLocaleString()
            requestCount.value = tmp.requestCount
            currency.value = tmp.ja.currency
            workPeriod.value = tmp.ja.workPeriod
            favorite.value = tmp.favorite
            like.value = tmp.like
            images.value = tmp.ja.images
            lang.value = langData
            firestore
              .collection('usersPublicData')
              .where('creatorId', '==', tmp.creatorId)
              .get()
              .then((publicSnapshot) => {
                publicSnapshot.forEach((doc) => {
                  picture.value = doc.data().picture
                  displayName.value = doc.data().displayName
                  isActive.value = doc.data().isActive
                })
                processing.value = false
              })
          })
        })
    }
  }

  // 作例モーダルで画像を表示する
  const viewSampleImage = (image: string) => {
    sampleImage.value = image
  }

  return {
    processing,
    myCreatorId,
    commissionId,
    creatorId,
    isActive,
    approval,
    release,
    picture,
    commissionTitle,
    commissionDescription,
    commissionType,
    commissionPrice,
    currency,
    workPeriod,
    displayName,
    requestCount,
    favorite,
    like,
    images,
    lang,
    currentCommissionId,
    currentCommissionTitle,
    sampleImage,
    initCommissionDetail,
    viewSampleImage,
  }
}

export type CommissionDetailStore = ReturnType<typeof useCommissionDetail>
export { useCommissionDetail }
