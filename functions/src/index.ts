import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as sgMail from '@sendgrid/mail'

admin.initializeApp()

// region指定
const f = functions.region('asia-northeast1')

const firestore = admin.firestore()

// SendGridのAPIキー
const sendGridApiKey = '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'

// 最低決済金額の定数
const minimumPayment = 1500
const minimumMultiPayment = minimumPayment * 2

// 話数単価から決済手数料を引いた額を取得する関数
const getExcludesFees = (amount: number) => amount - Math.round(amount * 0.036)

export const stripeWebhook = f.https.onRequest((request, response) => {
  const event = request.body

  switch (
    event.type // イベントのタイプに応じて処理を行う
  ) {
    case 'payment_intent.succeeded': {
      // 年月を格納
      const purchaseDate = new Date(event.created * 1000)
      const purchaseYear = purchaseDate.getFullYear()
      const purchaseMonth = purchaseDate.getMonth() + 1

      // メタデータからworkIdとepisodeIdを取得する
      const workAndEpisodeIds = event.data.object.metadata.workAndEpisodeId.split('-')
      const workId = workAndEpisodeIds[0]
      const episodeId = workAndEpisodeIds[1]

      firestore
        .collection('works')
        .where('workId', '==', Number(workId))
        .get()
        .then((worksSnapshot) => {
          worksSnapshot.forEach(async (worksDoc) => {
            // 作品全体のデータ
            const workAllSalesCollection = worksDoc.ref
              .collection(event.data.object.metadata.lang)
              .doc('sales')
              .collection('all')
            const workTotalSaleDocRef = workAllSalesCollection.doc('totalSale')
            const workMonthSaleDocRef = workAllSalesCollection.doc(
              `sale${purchaseYear}-${purchaseMonth}`
            )
            const unsettledDocRef = workAllSalesCollection.doc('unsettled')

            // エピソードごとののデータ
            const episodeSalesCollection = worksDoc.ref
              .collection(event.data.object.metadata.lang)
              .doc('sales')
              .collection(episodeId)
            const episodeTotalSaleDocRef = episodeSalesCollection.doc('totalSale')
            const episodeMonthSaleDocRef = episodeSalesCollection.doc(
              `sale${purchaseYear}-${purchaseMonth}`
            )
            const episodeSalesRef = episodeSalesCollection.doc(event.id)

            const batch = firestore.batch()
            const workTotalSaleDoc = await workTotalSaleDocRef.get()
            const workMonthSaleDoc = await workMonthSaleDocRef.get()
            const unsettledDoc = await unsettledDocRef.get()
            const episodeTotalSaleDoc = await episodeTotalSaleDocRef.get()
            const episodeMonthSaleDoc = await episodeMonthSaleDocRef.get()

            // 各作品総合売り上げ合計をfirestoreに格納
            if (!workTotalSaleDoc.exists) {
              batch.set(workTotalSaleDocRef, {
                createdAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
                totalPrice: event.data.object.amount,
                totalBill: getExcludesFees(event.data.object.amount),
                updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              })
            } else {
              batch.update(workTotalSaleDocRef, {
                totalPrice: admin.firestore.FieldValue.increment(event.data.object.amount),
                totalBill: admin.firestore.FieldValue.increment(
                  getExcludesFees(event.data.object.amount)
                ),
                updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              })
            }

            // 各作品の当月の売り上げ合計をfirestoreに格納
            if (!workMonthSaleDoc.exists) {
              batch.set(workMonthSaleDocRef, {
                createdAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
                totalPrice: event.data.object.amount,
                totalBill: getExcludesFees(event.data.object.amount),
                updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              })
            } else {
              batch.update(workMonthSaleDocRef, {
                totalPrice: admin.firestore.FieldValue.increment(event.data.object.amount),
                totalBill: admin.firestore.FieldValue.increment(
                  getExcludesFees(event.data.object.amount)
                ),
                updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              })
            }

            // 未決済金額Docがない場合をfirestoreに作成
            if (!unsettledDoc.exists) {
              batch.set(unsettledDocRef, {
                createdAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
                currentMonthPrice: 0,
                lastMonthPrice: 0,
                price: getExcludesFees(event.data.object.amount),
                updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              })
            } else {
              batch.update(unsettledDocRef, {
                price: admin.firestore.FieldValue.increment(
                  getExcludesFees(event.data.object.amount)
                ),
                updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              })
            }

            // 各話数の総合売り上げ合計をfirestoreに格納
            if (!episodeTotalSaleDoc.exists) {
              batch.set(episodeTotalSaleDocRef, {
                createdAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
                totalPrice: event.data.object.amount,
                totalBill: getExcludesFees(event.data.object.amount),
                updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              })
            } else {
              batch.update(episodeTotalSaleDocRef, {
                totalPrice: admin.firestore.FieldValue.increment(event.data.object.amount),
                totalBill: admin.firestore.FieldValue.increment(
                  getExcludesFees(event.data.object.amount)
                ),
                updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              })
            }

            // 各話数の当月の売り上げ合計をfirestoreに格納
            if (!episodeMonthSaleDoc.exists) {
              batch.set(episodeMonthSaleDocRef, {
                createdAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
                totalPrice: event.data.object.amount,
                totalBill: getExcludesFees(event.data.object.amount),
                updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              })
            } else {
              batch.update(episodeMonthSaleDocRef, {
                totalPrice: admin.firestore.FieldValue.increment(event.data.object.amount),
                totalBill: admin.firestore.FieldValue.increment(
                  getExcludesFees(event.data.object.amount)
                ),
                updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              })
            }

            // 各話数単体の売り上げをfirestoreに格納
            batch.set(episodeSalesRef, {
              createdAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
              amount: event.data.object.amount,
              billingAmount: getExcludesFees(event.data.object.amount),
              purchaseMonth: `${purchaseYear}-${purchaseMonth}`,
              updatedAt: admin.firestore.Timestamp.fromMillis(event.created * 1000),
            })

            // 一括コミット
            batch.commit()
          })
        })
      response.json({ received: true }) // ステータス200でレスポンスを返却
      break
    }
    case 'product.updated': {
      if (event.data.object.metadata.workAndEpisodeId && event.data.object.metadata.lang) {
        // メタデータからworkIdとepisodeIdを取得する
        const workAndEpisodeIds = event.data.object.metadata.workAndEpisodeId.split('-')
        const workId = workAndEpisodeIds[0]
        const episodeId = workAndEpisodeIds[1]

        if (event.data.object.active && event.data.object.default_price) {
          // 価格を取得した後に、その価格をworksのspisodePriceに格納する
          firestore
            .collection('products')
            .doc(event.data.object.id)
            .collection('prices')
            .doc(event.data.object.default_price)
            .get()
            .then((priceDoc) => {
              firestore
                .collection('works')
                .where('workId', '==', Number(workId))
                .get()
                .then((worksSnapshot) => {
                  worksSnapshot.forEach((worksDoc) => {
                    const episodeRef = worksDoc.ref
                      .collection(event.data.object.metadata.lang)
                      .doc('data')
                      .collection('episode')
                      .doc(episodeId)
                    episodeRef.get().then((episodeDoc) => {
                      if (episodeDoc.exists) {
                        episodeRef.update({
                          episodePrice: priceDoc.data()?.unit_amount,
                        })
                      }
                    })
                  })
                })
            })
        } else {
          firestore
            .collection('works')
            .where('workId', '==', Number(workId))
            .get()
            .then((worksSnapshot) => {
              worksSnapshot.forEach((worksDoc) => {
                const episodeRef = worksDoc.ref
                  .collection(event.data.object.metadata.lang)
                  .doc('data')
                  .collection('episode')
                  .doc(episodeId)
                episodeRef.get().then((episodeDoc) => {
                  if (episodeDoc.exists) {
                    episodeRef.update({
                      episodePrice: 0,
                    })
                  }
                })
              })
            })
        }
      }
      response.json({ received: true }) // ステータス200でレスポンスを返却
      break
    }
    default: {
      // 想定していないイベントが通知された場合
      return response.status(400).end() // ステータス400でレスポンスを返却
    }
  }
})

export const scheduledFunction = f.pubsub
  .schedule('1 of month 00:00')
  .timeZone('Asia/Tokyo')
  .onRun((context) => {
    // 処理時の時間をタイムスタンプで取得
    const now = new Date(context.timestamp).getTime()
    // 前月の日付と今月の日付でDocの名前を作る
    const date = new Date()
    const currentMonth = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const saleCurrentMonthDocName = `sale${currentMonth.getFullYear()}-${
      currentMonth.getMonth() + 1
    }`
    const lastMonth = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
    const saleLastMonthDocName = `sale${lastMonth.getFullYear()}-${lastMonth.getMonth() + 1}`
    firestore
      .collection('works')
      .get()
      .then((worksSnapshot) => {
        worksSnapshot.forEach(async (worksDoc) => {
          const isCreatorAll = worksDoc.data().creatorAllId !== 0
          const isOfficial = worksDoc.data().official
          const searchCreatorId = worksDoc.data().searchCreatorId
          const workAllSalesCollection = worksDoc.ref
            .collection('ja')
            .doc('sales')
            .collection('all')
          const currentMonthDocRef = workAllSalesCollection.doc(saleCurrentMonthDocName)
          const currentMonthDoc = await currentMonthDocRef.get()
          const unsettledDocRef = workAllSalesCollection.doc('unsettled')
          const unsettledDoc = await unsettledDocRef.get()
          if (!currentMonthDoc.exists) {
            currentMonthDocRef.set({
              createdAt: admin.firestore.Timestamp.fromMillis(now),
              totalPrice: 0,
              totalBill: 0,
              updatedAt: admin.firestore.Timestamp.fromMillis(now),
            })
          }
          await firestore
            .collection('usersPublicData')
            .where('creatorId', '!=', 0)
            .where('creatorId', 'in', searchCreatorId)
            .get()
            .then((usersPublicSnapshot) => {
              usersPublicSnapshot.forEach(async (usersPublicDoc) => {
                const uid = usersPublicDoc.id
                const monthlySaleDocRef = firestore.doc(
                  `usersSecretData/${uid}/monthlySale/${saleLastMonthDocName}`
                )
                await monthlySaleDocRef.set({
                  createdAt: admin.firestore.Timestamp.fromMillis(now),
                  price: 0,
                  done: false,
                  official: false,
                  updatedAt: admin.firestore.Timestamp.fromMillis(now),
                })
                if (unsettledDoc.exists) {
                  const unsettled = unsettledDoc.data()?.price ? unsettledDoc.data()?.price : 0
                  const lastMonthUnsettled = unsettledDoc.data()?.lastMonthPrice
                    ? unsettledDoc.data()?.lastMonthPrice
                    : 0
                  if (isCreatorAll) {
                    unsettledDocRef.update({
                      currentMonthPrice:
                        lastMonthUnsettled + unsettled >= minimumPayment
                          ? lastMonthUnsettled + unsettled
                          : 0,
                      lastMonthPrice:
                        lastMonthUnsettled + unsettled >= minimumPayment
                          ? 0
                          : lastMonthUnsettled + unsettled,
                      price: 0,
                      updatedAt: admin.firestore.Timestamp.fromMillis(now),
                    })
                    if (isOfficial) {
                      monthlySaleDocRef.update({
                        price: admin.firestore.FieldValue.increment(
                          lastMonthUnsettled + unsettled >= minimumPayment
                            ? lastMonthUnsettled +
                                unsettled -
                                Math.ceil((lastMonthUnsettled + unsettled) * 0.7)
                            : 0
                        ),
                        official: true,
                        updatedAt: admin.firestore.Timestamp.fromMillis(now),
                      })
                    } else {
                      monthlySaleDocRef.update({
                        price: admin.firestore.FieldValue.increment(
                          lastMonthUnsettled + unsettled >= minimumPayment
                            ? lastMonthUnsettled +
                                unsettled -
                                Math.ceil((lastMonthUnsettled + unsettled) * 0.3)
                            : 0
                        ),
                        updatedAt: admin.firestore.Timestamp.fromMillis(now),
                      })
                    }
                  } else {
                    unsettledDocRef.update({
                      currentMonthPrice:
                        lastMonthUnsettled + unsettled >= minimumMultiPayment
                          ? lastMonthUnsettled + unsettled
                          : 0,
                      lastMonthPrice:
                        lastMonthUnsettled + unsettled >= minimumMultiPayment
                          ? 0
                          : lastMonthUnsettled + unsettled,
                      price: 0,
                      updatedAt: admin.firestore.Timestamp.fromMillis(now),
                    })
                    if (isOfficial) {
                      monthlySaleDocRef.update({
                        price: admin.firestore.FieldValue.increment(
                          lastMonthUnsettled + unsettled >= minimumMultiPayment
                            ? (lastMonthUnsettled + unsettled) / 2 -
                                Math.ceil(((lastMonthUnsettled + unsettled) / 2) * 0.35)
                            : 0
                        ),
                        official: true,
                        updatedAt: admin.firestore.Timestamp.fromMillis(now),
                      })
                    } else {
                      monthlySaleDocRef.update({
                        price: admin.firestore.FieldValue.increment(
                          lastMonthUnsettled + unsettled >= minimumMultiPayment
                            ? (lastMonthUnsettled + unsettled) / 2 -
                                Math.ceil(((lastMonthUnsettled + unsettled) / 2) * 0.15)
                            : 0
                        ),
                        updatedAt: admin.firestore.Timestamp.fromMillis(now),
                      })
                    }
                  }
                }
              })
            })
        })
      })
    return null
  })

export const deleteUser = f.firestore.document('deletedUsers/{docId}').onCreate(async (snap, _) => {
  const deleteDocument = snap.data()
  const uid = deleteDocument.uid

  // Authenticationのユーザーを削除する
  await admin.auth().deleteUser(uid)
})

export const inquiryReceive = f.https.onRequest(async (req, res) => {
  sgMail.setApiKey(sendGridApiKey)
  sgMail.setSubstitutionWrappers('{{', '}}')

  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST')

  const msgReceive = {
    to: 'contact@pixage.co.jp',
    from: String(req.query.mail),
    subject: 'Pixageへのお問い合わせ',
    templateId: 'd-e0e9f4848506491291e16305074c052c',
    dynamicTemplateData: {
      name: String(req.query.name),
      mail: String(req.query.mail),
      subject: String(req.query.subject),
      content: String(req.query.content),
    },
  }
  const msgReply = {
    to: String(req.query.mail),
    from: 'no-reply@pixage.co.jp',
    subject: `【Pixage】お問い合わせありがとうございます`,
    templateId: 'd-46d52cbc9ae3423a9671e4b9ee07059e',
    dynamicTemplateData: {
      name: String(req.query.name),
      content: String(req.query.content),
    },
  }
  await sgMail.send(msgReceive)
  await sgMail.send(msgReply)
  res.end()
})

export const commissionNewNotification = f.https.onRequest(async (req, res) => {
  sgMail.setApiKey(sendGridApiKey)
  sgMail.setSubstitutionWrappers('{{', '}}')

  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST')

  const generateCommissionType = () => {
    if (String(req.query.type) === 'comic') {
      return '漫画'
    } else if (String(req.query.type) === 'illust') {
      return 'イラスト'
    } else if (String(req.query.type) === 'cosplay') {
      return 'コスプレ'
    } else {
      return 'アニメ'
    }
  }

  const msg = {
    to: 'commission@pixage.co.jp',
    from: 'no-reply@pixage.co.jp',
    subject: '新規コミッションが作成されました',
    templateId: 'd-2531acdbd46b4b3da236f9feb663a785',
    dynamicTemplateData: {
      title: String(req.query.title),
      type: generateCommissionType(),
    },
  }
  await sgMail.send(msg)
  res.end()
})

export const commissionEditNotification = f.https.onRequest(async (req, res) => {
  sgMail.setApiKey(sendGridApiKey)
  sgMail.setSubstitutionWrappers('{{', '}}')

  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST')

  const generateCommissionType = () => {
    if (String(req.query.type) === 'comic') {
      return '漫画'
    } else if (String(req.query.type) === 'illust') {
      return 'イラスト'
    } else if (String(req.query.type) === 'cosplay') {
      return 'コスプレ'
    } else {
      return 'アニメ'
    }
  }

  const msg = {
    to: 'commission@pixage.co.jp',
    from: 'no-reply@pixage.co.jp',
    subject: '既存のコミッションが編集されました',
    templateId: 'd-38e0b5683098498d833fba265114ad5d',
    dynamicTemplateData: {
      title: String(req.query.title),
      type: generateCommissionType(),
    },
  }
  await sgMail.send(msg)
  res.end()
})

export const postWorkNotification = f.https.onRequest(async (req, res) => {
  sgMail.setApiKey(sendGridApiKey)
  sgMail.setSubstitutionWrappers('{{', '}}')

  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST')

  const msg = {
    to: 'postwork@pixage.co.jp',
    from: 'no-reply@pixage.co.jp',
    subject: 'クリエイターから作品が投稿されました',
    templateId: 'd-6730709751e34db595879cc517732ed5',
    dynamicTemplateData: {
      title: String(req.query.title),
      name: String(req.query.name),
      genre: String(req.query.genre),
      isExisting: String(req.query.isExisting),
      episodeNum: String(req.query.episodeNum),
      currency: String(req.query.currency),
      episodePrice: String(req.query.episodePrice),
    },
  }
  await sgMail.send(msg)
  res.end()
})
