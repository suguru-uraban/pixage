import { ref, useContext } from '@nuxtjs/composition-api'
import { loadStripe } from '@stripe/stripe-js'
import { firestore } from '@/plugins/firebase'
import { getUserFromCookie } from '@/utils/cookieDecode'
import { CheckoutSessionDoc } from '@/types/stripe'

const useStripe = () => {
  /** composition-api **/
  const { app } = useContext()
  /** /composition-api **/

  // 現在のユーザーをcookieから取得
  const user = getUserFromCookie(app.$cookie.get('__session'))

  // 決済画面遷移の通信中か否かの判定
  const processingStripe = ref<boolean>(false)

  // 商品の価格IDを格納
  const priceId = ref<string>('')

  // 商品の価格を格納
  const price = ref<number>(0)

  // 税率IDを格納
  const taxIds = ref<string[]>([])

  // stripeの決済画面へ遷移する関数
  const handleClickStripe = (workAndEpisodeId: string, lang: string, url: string) => {
    processingStripe.value = true
    return new Promise((resolve, reject) => {
      firestore
        .collection('products')
        .doc('tax_rates')
        .collection('tax_rates')
        .get()
        .then((taxSnapshot) => {
          taxSnapshot.forEach((taxDoc) => {
            taxIds.value.push(taxDoc.id)
          })
          firestore
            .collection('products')
            .where('stripe_metadata_workAndEpisodeId', '==', workAndEpisodeId)
            .get()
            .then((qerySnapshot) => {
              qerySnapshot.forEach(async (doc) => {
                const subCollection = await doc.ref.collection('prices').get()
                subCollection.forEach((subDoc) => {
                  priceId.value = subDoc.id
                  price.value = subDoc.data().unit_amount
                })
                const docRef = await firestore
                  .collection('customers')
                  .doc(user?.user_id)
                  .collection('checkout_sessions')
                  .add({
                    mode: 'payment',
                    amount: price.value,
                    automatic_payment_methods: {
                      enabled: true,
                    },
                    payment_method_options: {
                      card: {
                        setup_future_usage: 'off_session',
                      },
                    },
                    line_items: [
                      {
                        price: priceId.value,
                        quantity: 1,
                      },
                    ],
                    tax_rates: taxIds.value,
                    success_url: url,
                    cancel_url: url,
                    metadata: {
                      workAndEpisodeId,
                      lang,
                    },
                  })
                docRef.onSnapshot(async (snap) => {
                  const { error, sessionId } = snap.data() as CheckoutSessionDoc
                  if (error) {
                    processingStripe.value = false
                    return reject(error)
                  }
                  if (sessionId) {
                    const stripe = await loadStripe(
                      'pk_live_51LRsw5IFUU3i3nukiGUpzhZ24bvUNJ2LaNRFe2NagNMiKjXlESehfRRj9zxHBmtWzP1vPYAf2DLfGzKaluBmXicf00lsKWaXTG'
                    )
                    // eslint-disable-next-line prefer-promise-reject-errors
                    if (!stripe) return reject()
                    processingStripe.value = false
                    stripe.redirectToCheckout({ sessionId })
                    return resolve(undefined)
                  }
                })
              })
            })
        })
    })
  }

  return {
    processingStripe,
    handleClickStripe,
  }
}

export type StripeStore = ReturnType<typeof useStripe>
export { useStripe }
