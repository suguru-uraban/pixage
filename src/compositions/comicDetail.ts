import { reactive, ref, SetupContext, useContext } from '@nuxtjs/composition-api'
import firebase, { firestore, timestamp } from '@/plugins/firebase'
import { getUserFromCookie } from '@/utils/cookieDecode'
import { getArrayMax } from '@/utils/util'

const useComicDetail = () => {
  /** composition-api **/
  const { app, redirect } = useContext()
  /** /composition-api **/

  // 現在のユーザーをcookieから取得
  const user = getUserFromCookie(app.$cookie.get('__session'))

  // ユーザー画面上部が通信中かどうかの判定
  const processingData = ref<boolean>(true)

  // ユーザー画面下部が通信中かどうかの判定
  const processingEpisode = ref<boolean>(true)

  // ユーザー画面上部の参照
  const dataRef = ref<any>()

  // ユーザー画面下部の参照
  const episodeRef = ref<any>()

  // 作品のUIDの格納先
  const workUid = ref<string>('')

  // 自分の作品であることを探知するためのクリエイターID配列の格納先
  const searchCreatorId = ref<number[]>([])

  // サムネイルファイルの格納先
  const thumbnail = ref<File | null>(null)

  // 作品名の格納先
  const workTitle = ref<string>('')

  // 概要の格納先
  const workDescription = ref<string>('')

  // クリエイター名の格納先
  const creator = reactive({
    all: '',
    story: '',
    drawing: '',
  })

  // クリエイターIDの格納先（0の場合は非クリエイター）
  const creatorIds = reactive({
    all: 0,
    story: 0,
    drawing: 0,
  })

  // 総いいね数の格納先
  const totalLike = ref<number>(0)

  // お気に入り数の格納先
  const favorite = ref<number>(0)

  // すでにお気に入りに入れているかの判定
  const isFavoriteWorks = ref<boolean>(false)

  // お気に入りに入れている作品のUIDの格納先
  const favoriteWorksUid = ref<string>('')

  // ジャンルを格納
  const genre = ref<string>('')

  // 公式かどうかの判定
  const official = ref<boolean>(false)

  // 言語の格納先
  const lang = ref<string>('')

  // エピソードのfirestoreデータの格納先
  const episodes = ref<firebase.firestore.DocumentData[]>([])

  // エピソードに最終購入日を追加したデータの格納先
  const episodesWithLatestBuy = ref<firebase.firestore.DocumentData[]>([])

  // 顧客情報の格納先
  const customers = ref<firebase.firestore.DocumentData[]>([])

  // プレビューする原稿のURL配列の格納先
  const previewImages = ref<string[]>([])

  // エピソードIDを格納
  const episodeId = ref<number>(0)

  // プレビューするかどうかの判定
  const isPreview = ref<boolean>(false)

  // 現在のエピソードIDの格納先
  const currentEpisodeId = ref<number>(0)

  // 値を初期化する（管理画面）
  const initComicDetailVariables = () => {
    workUid.value = ''
    thumbnail.value = null
    workTitle.value = ''
    workDescription.value = ''
    creator.all = ''
    creator.story = ''
    creator.drawing = ''
    totalLike.value = 0
    favorite.value = 0
    genre.value = ''
    official.value = false
    lang.value = ''
    episodes.value = []
    previewImages.value = []
    episodeId.value = 0
    isPreview.value = false
    currentEpisodeId.value = 0
  }

  // 値を初期化する（ユーザー画面上部）
  const initComicDataVariables = () => {
    workUid.value = ''
    thumbnail.value = null
    workTitle.value = ''
    workDescription.value = ''
    creator.all = ''
    creator.story = ''
    creator.drawing = ''
    creatorIds.all = 0
    creatorIds.story = 0
    creatorIds.drawing = 0
    totalLike.value = 0
    favorite.value = 0
    isFavoriteWorks.value = false
    genre.value = ''
    official.value = false
  }

  // 値を初期化する（ユーザー画面下部）
  const initComicEpisodesVariables = () => {
    workUid.value = ''
    searchCreatorId.value = []
    episodes.value.length = 0
    customers.value.length = 0
    episodesWithLatestBuy.value.length = 0
    previewImages.value = []
    episodeId.value = 0
    isPreview.value = false
  }

  // 作品詳細の初期化（管理画面）
  const initComicDetail = (id: string) => {
    if (id !== undefined) {
      firestore
        .collection('works')
        .where('workId', '==', Number(id))
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            workUid.value = doc.id
            let loopCount = 0
            const tmp = doc.data()
            const langData = doc.ref.collection('ja').id
            const subDocRef = await doc.ref.collection('ja').doc('data').get()
            const episodeCollection = await doc.ref
              .collection('ja')
              .doc('data')
              .collection('episode')
              .get()
            tmp.ja = subDocRef.data()
            thumbnail.value = tmp.ja.thumbnail
            workTitle.value = tmp.ja.workTitle
            workDescription.value = tmp.ja.workDescription
            genre.value = tmp.ja.genre
            totalLike.value = tmp.totalLike
            favorite.value = tmp.favorite
            official.value = tmp.official
            lang.value = langData
            Object.values({
              all: doc.data().creatorAllId,
              story: doc.data().creatorStoryId,
              drawing: doc.data().creatorDrawingId,
            }).forEach((creatorId, index) => {
              firestore
                .collection('usersPublicData')
                .where('creatorId', '==', creatorId)
                .get()
                .then((userSnapshot) => {
                  userSnapshot.forEach((user) => {
                    if (index === 0) {
                      creator.all = creatorId !== 0 ? user.data().displayName : ''
                    } else if (index === 1) {
                      creator.story = creatorId !== 0 ? user.data().displayName : ''
                    } else {
                      creator.drawing = creatorId !== 0 ? user.data().displayName : ''
                    }
                  })
                })
            })
            episodeCollection.forEach((episodeDoc) => {
              loopCount += 1
              episodes.value.push(episodeDoc.data())
              if (loopCount === episodeCollection.size) {
                episodes.value.sort((a, b) => {
                  if (a.episodeId > b.episodeId) return -1
                  if (a.episodeId < b.episodeId) return 1
                  return 0
                })
              }
            })
          })
        })
    }
  }

  // 作品詳細の初期化（ユーザー画面上部）
  const initComicData = async (ctx: SetupContext, workId: number) => {
    if (workId !== undefined) {
      if (user) {
        await firestore
          .collection('usersSecretData')
          .doc(user.user_id)
          .collection('favoriteWorks')
          .where('workId', '==', workId)
          .get()
          .then((favoriteSnapshot) => {
            if (!favoriteSnapshot.empty) {
              isFavoriteWorks.value = true
            }
          })
      }
      firestore
        .collection('works')
        .where('workId', '==', workId)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            redirect('/error')
          }
          querySnapshot.forEach(async (doc) => {
            if (doc.data().release === false) {
              redirect('/error')
            } else {
              const tmp = doc.data()
              const subDocRef = await doc.ref.collection('ja').doc('data').get()
              tmp.ja = subDocRef.data()
              thumbnail.value = tmp.ja.thumbnail
              workTitle.value = tmp.ja.workTitle
              workDescription.value = tmp.ja.workDescription
              genre.value = tmp.ja.genre
              totalLike.value = tmp.totalLike
              favorite.value = tmp.favorite
              official.value = tmp.official
              ctx.emit('get-title', workTitle.value)
              ctx.emit('get-meta', {
                workDescription: workDescription.value,
                thumbnail: thumbnail.value,
              })
              Object.values({
                all: doc.data().creatorAllId,
                story: doc.data().creatorStoryId,
                drawing: doc.data().creatorDrawingId,
              }).forEach((creatorId, index) => {
                firestore
                  .collection('usersPublicData')
                  .where('creatorId', '==', creatorId)
                  .get()
                  .then((userSnapshot) => {
                    userSnapshot.forEach((user) => {
                      if (index === 0) {
                        creator.all = creatorId !== 0 ? user.data().displayName : ''
                        creatorIds.all = creatorId
                      } else if (index === 1) {
                        creator.story = creatorId !== 0 ? user.data().displayName : ''
                        creatorIds.story = creatorId
                      } else {
                        creator.drawing = creatorId !== 0 ? user.data().displayName : ''
                        creatorIds.drawing = creatorId
                      }
                    })
                  })
              })
            }
          })
          ctx.emit('loading-done')
        })
    }
  }

  // 作品詳細の初期化（ユーザー画面下部）
  const initComicEpisodes = async (ctx: SetupContext, workId: number) => {
    workUid.value = ''
    searchCreatorId.value = []
    episodes.value.length = 0
    customers.value.length = 0
    episodesWithLatestBuy.value.length = 0
    episodeId.value = 0
    if (workId !== undefined) {
      if (user) {
        await firestore
          .collection('customers')
          .doc(user?.user_id)
          .collection('payments')
          .where('status', '==', 'succeeded')
          .get()
          .then((customerSnapshot) => {
            customerSnapshot.forEach((customerDoc) => {
              customers.value.push(customerDoc.data())
            })
          })
      }
      firestore
        .collection('works')
        .where('workId', '==', workId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            workUid.value = doc.id
            searchCreatorId.value = [].concat(doc.data().searchCreatorId)
            let loopCount = 0
            const episodeCollection = await doc.ref
              .collection('ja')
              .doc('data')
              .collection('episode')
              .where('release', '==', true)
              .get()
            episodeCollection.forEach(async (episodeDoc) => {
              episodes.value.push(episodeDoc.data())
              await firestore
                .collection('products')
                .where(
                  'stripe_metadata_workAndEpisodeId',
                  '==',
                  `${workId}-${episodeDoc.data().episodeId}`
                )
                .get()
                .then((productSnapshot) => {
                  productSnapshot.forEach((productDoc) => {
                    episodes.value[loopCount].productId = productDoc.id
                    const episodeCustomer = customers.value
                      .filter((customer) => customer.items[0].price.product === productDoc.id)
                      .map((value) => value.created * 1000)
                    const latestCustomerCreated = episodeCustomer.length
                      ? getArrayMax(episodeCustomer)
                      : 0
                    episodes.value[loopCount].customerCreated = latestCustomerCreated
                    episodesWithLatestBuy.value.push(episodes.value[loopCount])
                    loopCount += 1
                    if (loopCount === episodeCollection.size) {
                      episodesWithLatestBuy.value.sort((a, b) => {
                        if (a.episodeId > b.episodeId) return -1
                        if (a.episodeId < b.episodeId) return 1
                        return 0
                      })
                    }
                  })
                })
            })
          })
        })
      ctx.emit('loading-done')
    }
  }

  // 話数をプレビューする
  const episodePreview = async (id: number) => {
    const imagesRef = await firestore.doc(`workImages/${workUid.value}/ja/${String(id)}`).get()
    previewImages.value = imagesRef.data()?.images
    episodeId.value = id
    isPreview.value = true
  }

  // プレビューを閉じる
  const episodePreviewClose = () => {
    previewImages.value = []
    episodeId.value = 0
    isPreview.value = false
  }

  // 話数の公開・非公開を切り替える
  const switchRelease = () => {
    let episodeLoopCount = 0
    episodes.value = []
    const episodeRef = firestore
      .collection('works')
      .doc(workUid.value)
      .collection('ja')
      .doc('data')
      .collection('episode')
      .get()
    episodeRef.then((episodeSnapshot) => {
      episodeSnapshot.forEach((doc) => {
        episodeLoopCount += 1
        episodes.value.push(doc.data())
        if (episodeLoopCount === episodeSnapshot.size) {
          episodes.value.sort((a, b) => {
            if (a.episodeId > b.episodeId) return -1
            if (a.episodeId < b.episodeId) return 1
            return 0
          })
        }
      })
    })
  }

  // ボタンをクリックしてお気に入りに追加
  const clickFavorite = async (ctx: SetupContext, workId: number) => {
    if (user) {
      await firestore
        .collection('works')
        .where('workId', '==', workId)
        .get()
        .then((workSnapshot) => {
          workSnapshot.forEach((doc) => {
            workUid.value = doc.id
          })
          const batch = firestore.batch()
          const workRef = firestore.doc(`works/${workUid.value}`)
          if (!isFavoriteWorks.value) {
            const favoriteWorksRef = firestore
              .doc(`usersSecretData/${user.user_id}`)
              .collection('favoriteWorks')
              .doc()
            batch.set(favoriteWorksRef, {
              workId,
              createdAt: timestamp,
              updatedAt: timestamp,
            })
            batch.update(workRef, {
              favorite: firebase.firestore.FieldValue.increment(1),
              popular: firebase.firestore.FieldValue.increment(1),
              updatedAt: timestamp,
            })
            batch.commit().then(() => {
              initComicData(ctx, workId)
              isFavoriteWorks.value = true
            })
          } else {
            firestore
              .collection('usersSecretData')
              .doc(`${user.user_id}`)
              .collection('favoriteWorks')
              .where('workId', '==', workId)
              .get()
              .then((workSnapshot) => {
                workSnapshot.forEach((doc) => {
                  favoriteWorksUid.value = doc.id
                })
                firestore
                  .doc(`usersSecretData/${user.user_id}/favoriteWorks/${favoriteWorksUid.value}`)
                  .delete()
                batch.update(workRef, {
                  favorite: firebase.firestore.FieldValue.increment(-1),
                  popular: firebase.firestore.FieldValue.increment(-1),
                  updatedAt: timestamp,
                })
                batch.commit().then(() => {
                  initComicData(ctx, workId)
                  isFavoriteWorks.value = false
                })
              })
          }
        })
    }
  }

  // いいねを押した場合リロードして値を更新する
  const reload = (ctx: SetupContext) => {
    ctx.emit('reload')
  }

  // ユーザー画面上部の通信完了
  const closeProcessingData = () => {
    setTimeout(() => {
      processingData.value = false
    }, 500)
  }

  // ユーザー画面下部の通信完了
  const closeProcessingEpisode = () => {
    setTimeout(() => {
      processingEpisode.value = false
    }, 500)
  }

  return {
    processingData,
    processingEpisode,
    dataRef,
    episodeRef,
    workUid,
    searchCreatorId,
    thumbnail,
    workTitle,
    workDescription,
    creator,
    creatorIds,
    genre,
    totalLike,
    favorite,
    isFavoriteWorks,
    official,
    lang,
    episodes,
    episodesWithLatestBuy,
    previewImages,
    episodeId,
    isPreview,
    currentEpisodeId,
    initComicDetailVariables,
    initComicDataVariables,
    initComicEpisodesVariables,
    initComicDetail,
    initComicData,
    initComicEpisodes,
    episodePreview,
    episodePreviewClose,
    switchRelease,
    clickFavorite,
    reload,
    closeProcessingData,
    closeProcessingEpisode,
  }
}

export type ComicDetailStore = ReturnType<typeof useComicDetail>
export { useComicDetail }
