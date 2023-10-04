import { ref } from '@nuxtjs/composition-api'
import firebase, { firestore, timestamp } from '@/plugins/firebase'

const usePaymentList = () => {
  // 現在の日付を取得
  const date = new Date()

  // 現在の年を格納
  const year = ref<string>(date.getFullYear().toString())

  // 現在の月を格納（デフォルトで前月）
  const month = ref<string>(
    (new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()).getMonth() + 1).toString()
  )

  // 支払いリストの格納先
  const paymentList = ref<firebase.firestore.DocumentData[]>([])

  // 支払い口座のないリストの格納先
  const noReceivableAccountList = ref<firebase.firestore.DocumentData[]>([])

  // 支払いリストの初期化
  const initPaymentList = () => {
    paymentList.value = []
    noReceivableAccountList.value = []
    let loopCount = 1
    firestore
      .collection('usersPublicData')
      .where('creatorId', '!=', 0)
      .get()
      .then((usersPublicSnapshot) => {
        if (!usersPublicSnapshot.empty) {
          usersPublicSnapshot.forEach((usersPublicDoc) => {
            const id = usersPublicDoc.id
            const tmp = usersPublicDoc.data()
            firestore
              .collection('usersSecretData')
              .doc(id)
              .get()
              .then(async (usersSecretDoc) => {
                const email = usersSecretDoc.data()?.email
                const monthlySaleDoc = await usersSecretDoc.ref
                  .collection(`monthlySale`)
                  .doc(`sale${year.value}-${month.value}`)
                  .get()
                const receivableAccountDoc = await usersSecretDoc.ref
                  .collection('receivableAccount')
                  .doc('data')
                  .get()
                if (
                  monthlySaleDoc.exists &&
                  !receivableAccountDoc.exists &&
                  monthlySaleDoc.data()?.price !== 0
                ) {
                  noReceivableAccountList.value.push({
                    uid: id,
                    displayName: tmp.displayName,
                    price: monthlySaleDoc.data()?.price,
                    official: monthlySaleDoc.data()?.official,
                    email,
                  })
                }
                if (
                  monthlySaleDoc.exists &&
                  receivableAccountDoc.exists &&
                  monthlySaleDoc.data()?.price !== 0
                ) {
                  paymentList.value.push({
                    uid: id,
                    displayName: tmp.displayName,
                    price: monthlySaleDoc.data()?.price,
                    official: monthlySaleDoc.data()?.official,
                    accountName: receivableAccountDoc.data()?.accountName,
                    financialInstitutionName: receivableAccountDoc.data()?.financialInstitutionName,
                    branchName: receivableAccountDoc.data()?.branchName,
                    accountNumber: receivableAccountDoc.data()?.accountNumber,
                    phoneNumber: receivableAccountDoc.data()?.phoneNumber,
                    done: monthlySaleDoc.data()?.done,
                  })
                }
              })
          })
          if (usersPublicSnapshot.size === loopCount) {
            paymentList.value.sort((a, b) => {
              if (a.workId > b.workId) return 1
              if (a.workId < b.workId) return -1
              return 0
            })
          }
          loopCount += 1
        }
      })
  }

  // 支払い完了のチェックを入れる
  const donePayment = (uid: string) => {
    firestore
      .doc(`usersSecretData/${uid}/monthlySale/sale${year.value}-${month.value}`)
      .update({
        done: true,
        updatedAt: timestamp,
      })
      .then(() => {
        initPaymentList()
      })
  }

  return {
    year,
    month,
    paymentList,
    noReceivableAccountList,
    initPaymentList,
    donePayment,
  }
}

export type PaymentListStore = ReturnType<typeof usePaymentList>
export { usePaymentList }
