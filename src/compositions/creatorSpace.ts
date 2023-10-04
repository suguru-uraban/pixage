import { firestore } from '@/plugins/firebase'
import { ref, useContext } from '@nuxtjs/composition-api'
import { getUserFromCookie } from '@/utils/cookieDecode'
import { commissionLimit } from '@/constants/commissionLimit'

const useCreatorSpace = () => {
  /** composition-api **/
  const { app } = useContext()
  /** composition-api **/

  /** Variables **/
  const user = getUserFromCookie(app.$cookie.get('__session'))
  /** /Variables **/

  // クリエイターガイドラインを読んだかチェックの判定
  const isAgreementGuideLine = ref<boolean>(false)

  // 売り上げがあるのに口座情報が入力されていない場合の判定
  const isNotReceivableAccount = ref<boolean>(false)

  // コミッションが制限値まで登録されているかどうかの判定
  const isCommissionLimit = ref<boolean>(false)

  // 売り上げがあるのに口座情報が入力されていない場合の処理
  const checkReceivableAccount = () => {
    isNotReceivableAccount.value = false
    firestore
      .collection('usersSecretData')
      .doc(user?.user_id)
      .get()
      .then(async (usersSecretDoc) => {
        const monthlySaleCollection = await usersSecretDoc.ref.collection(`monthlySale`).get()
        const receivableAccountDoc = await usersSecretDoc.ref
          .collection('receivableAccount')
          .doc('data')
          .get()
        if (!monthlySaleCollection.empty && !receivableAccountDoc.exists) {
          isNotReceivableAccount.value = true
        }
      })
  }

  // コミッションの制限数に達した場合の処理
  const checkCommissionLimit = () => {
    firestore
      .collection('usersPublicData')
      .doc(user?.user_id)
      .get()
      .then((usersPublicData) => {
        const creatorId = usersPublicData.data()?.creatorId
        if (creatorId !== 0) {
          let loopCount = 0
          firestore
            .collection('commissions')
            .where('creatorId', '==', creatorId)
            .get()
            .then((commissionSnapshot) => {
              commissionSnapshot.forEach((_) => {
                loopCount += 1
              })
              if (loopCount >= commissionLimit) {
                isCommissionLimit.value = true
              }
            })
        }
      })
  }

  return {
    isAgreementGuideLine,
    isNotReceivableAccount,
    isCommissionLimit,
    checkReceivableAccount,
    checkCommissionLimit,
  }
}

export type CreatorSpaceStore = ReturnType<typeof useCreatorSpace>
export { useCreatorSpace }
