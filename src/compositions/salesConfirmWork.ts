import { ref } from '@nuxtjs/composition-api'
import firebase, { firestore } from '@/plugins/firebase'

const useSalesConfirmWork = () => {
  // 通信中かどうかの判定
  const processing = ref<boolean>(false)

  // 課金される作品のリストの格納先
  const salesConfirmWorks = ref<firebase.firestore.DocumentData[]>([])

  // 著者が一人か二人かの判定
  const isMultipleAuthors = ref<boolean>(false)

  // 公式作品かどうかの判定
  const isOfficial = ref<boolean>(false)

  // 作品の総売り上げ額を格納
  const workTotalPrice = ref<number>(0)

  // 作品の前月末での請求可能額を格納
  const workBillablePrice = ref<number>(0)

  // 作品の当月の請求額（Pixage側の手数料を引く前）を格納
  const workCurrentMonthBill = ref<number>(0)

  // 作品の当月までの未決済額を格納
  const workUnsettled = ref<number>(0)

  // 各話数の売り上げを格納
  const episodePrices = ref<{ num: string; title: string; amount: number }[]>([])

  // 課金される作品のリストを初期化
  const initSalesConfirmWorksList = (creatorId: number) => {
    salesConfirmWorks.value = []
    let loopCount = 1
    firestore
      .collection('works')
      .where('searchCreatorId', 'array-contains', creatorId)
      .get()
      .then((worksSnapshot) => {
        if (!worksSnapshot.empty) {
          worksSnapshot.forEach(async (worksDoc) => {
            const workId = worksDoc.data().workId
            const langDataDoc = await worksDoc.ref.collection('ja').doc('data').get()
            const langTotalSaleDoc = await worksDoc.ref
              .collection('ja')
              .doc('sales')
              .collection('all')
              .doc('totalSale')
              .get()
            salesConfirmWorks.value.push({
              workId,
              workTitle: langDataDoc.data()?.workTitle,
              totalPrice: langTotalSaleDoc.data()?.totalPrice ?? 0,
            })
            if (worksSnapshot.size === loopCount) {
              salesConfirmWorks.value.sort((a, b) => {
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

  // 売り上げ詳細の初期化
  const initSalesConfirmWorkDetail = (workId: number) => {
    const now = new Date()
    const nowYear = now.getFullYear()
    const nowMonth = now.getMonth() + 1
    workTotalPrice.value = 0
    workBillablePrice.value = 0
    episodePrices.value.length = 0
    if (workId !== 0) {
      processing.value = true
      firestore
        .collection('works')
        .where('workId', '==', workId)
        .get()
        .then((worksSnapshot) => {
          worksSnapshot.forEach(async (worksDoc) => {
            const episodeCountIds: string[] = []
            isMultipleAuthors.value = worksDoc.data().creatorAllId === 0
            isOfficial.value = worksDoc.data().official
            const langEpisodeCount = await worksDoc.ref
              .collection('ja')
              .doc('data')
              .collection('episode')
              .get()
            const langTotalSaleDoc = await worksDoc.ref
              .collection('ja')
              .doc('sales')
              .collection('all')
              .doc('totalSale')
              .get()
            const langMonthSaleDoc = await worksDoc.ref
              .collection('ja')
              .doc('sales')
              .collection('all')
              .doc(`sale${nowYear}-${nowMonth}`)
              .get()
            const langUnsettledDoc = await worksDoc.ref
              .collection('ja')
              .doc('sales')
              .collection('all')
              .doc('unsettled')
              .get()
            const langEpisodesSalesDocRef = worksDoc.ref.collection('ja').doc('sales')
            workTotalPrice.value = langTotalSaleDoc.data()?.totalPrice ?? 0
            if (isMultipleAuthors.value) {
              workBillablePrice.value =
                (langUnsettledDoc.data()?.currentMonthPrice ?? 0) > 0
                  ? langUnsettledDoc.data()?.currentMonthPrice / 2 ?? 0
                  : 0
            } else {
              workBillablePrice.value =
                (langUnsettledDoc.data()?.currentMonthPrice ?? 0) > 0
                  ? langUnsettledDoc.data()?.currentMonthPrice ?? 0
                  : 0
            }
            workCurrentMonthBill.value = langMonthSaleDoc.data()?.totalBill ?? 0
            workUnsettled.value = langUnsettledDoc.data()?.lastMonthPrice ?? 0
            langEpisodeCount.forEach((episodeCount) => {
              episodeCountIds.push(episodeCount.id)
              episodePrices.value.push({
                num: episodeCount.data().episodeNum,
                title: episodeCount.data().episodeTitle,
                amount: 0,
              })
            })
            episodeCountIds.forEach((episodesCountId, index) => {
              langEpisodesSalesDocRef
                .collection(episodesCountId)
                .doc(`sale${nowYear}-${nowMonth}`)
                .get()
                .then((episodesMonthSaleDoc) => {
                  episodePrices.value[index].amount = episodesMonthSaleDoc.data()?.totalPrice ?? 0
                })
            })
            setTimeout(() => {
              processing.value = false
            }, 500)
          })
        })
    }
  }

  return {
    processing,
    salesConfirmWorks,
    isMultipleAuthors,
    isOfficial,
    workTotalPrice,
    workBillablePrice,
    workCurrentMonthBill,
    workUnsettled,
    episodePrices,
    initSalesConfirmWorksList,
    initSalesConfirmWorkDetail,
  }
}

export type SalesConfirmWorkStore = ReturnType<typeof useSalesConfirmWork>
export { useSalesConfirmWork }
