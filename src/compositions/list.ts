import { ref, SetupContext, useContext } from '@nuxtjs/composition-api'
import firebase, { firestore } from '@/plugins/firebase'
import { $cookiesOpt } from '@/plugins/cookie'
import { getUserFromCookie } from '@/utils/cookieDecode'
import { sliceByNumber } from '@/utils/util'
import { CommissionType } from '@/types/commissionType'

const useList = () => {
  /** composition-api **/
  const { app } = useContext()
  /** /composition-api **/

  // 現在のユーザーをcookieから取得
  const user = getUserFromCookie(app.$cookie.get('__session'))

  // 作品リストを格納
  const works = ref<firebase.firestore.DocumentData>([])

  // お気に入りのuidを格納
  const favoriteIds = ref<number[]>([])

  // コミッションリスト（漫画）を格納
  const commissionsComic = ref<firebase.firestore.DocumentData>([])

  // コミッションリスト（コスプレ）を格納
  const commissionsCosplay = ref<firebase.firestore.DocumentData>([])

  // コミッションリスト（アニメ）を格納
  const commissionsAnime = ref<firebase.firestore.DocumentData>([])

  // コミッションリスト（イラスト）を格納
  const commissionsIllust = ref<firebase.firestore.DocumentData>([])

  // 作品一覧のソートの種類を格納
  const sortType = ref<string>(
    app.$cookie.get('sortType')
      ? app.$cookie.get('sortType') === 'workId' ||
        app.$cookie.get('sortType') === 'updatedAt' ||
        app.$cookie.get('sortType') === 'popular'
        ? app.$cookie.get('sortType')
        : 'workId'
      : 'workId'
  )

  // コミッション（漫画）一覧のソートの種類を格納
  const commissionComicSortType = ref<string>(
    app.$cookie.get('commissionComicSortType')
      ? app.$cookie.get('commissionComicSortType') === 'commissionId' ||
        app.$cookie.get('commissionComicSortType') === 'updatedAt' ||
        app.$cookie.get('commissionComicSortType') === 'popular'
        ? app.$cookie.get('commissionComicSortType')
        : 'commissionId'
      : 'commissionId'
  )

  // コミッション（コスプレ）一覧のソートの種類を格納
  const commissionCosplaySortType = ref<string>(
    app.$cookie.get('commissionCosplaySortType')
      ? app.$cookie.get('commissionCosplaySortType') === 'commissionId' ||
        app.$cookie.get('commissionCosplaySortType') === 'updatedAt' ||
        app.$cookie.get('commissionCosplaySortType') === 'popular'
        ? app.$cookie.get('commissionCosplaySortType')
        : 'commissionId'
      : 'commissionId'
  )

  // コミッション（アニメ）一覧のソートの種類を格納
  const commissionAnimeSortType = ref<string>(
    app.$cookie.get('commissionAnimeSortType')
      ? app.$cookie.get('commissionAnimeSortType') === 'commissionId' ||
        app.$cookie.get('commissionAnimeSortType') === 'updatedAt' ||
        app.$cookie.get('commissionAnimeSortType') === 'popular'
        ? app.$cookie.get('commissionAnimeSortType')
        : 'commissionId'
      : 'commissionId'
  )

  // コミッション（イラスト）一覧のソートの種類を格納
  const commissionIllustSortType = ref<string>(
    app.$cookie.get('commissionIllustSortType')
      ? app.$cookie.get('commissionIllustSortType') === 'commissionId' ||
        app.$cookie.get('commissionIllustSortType') === 'updatedAt' ||
        app.$cookie.get('commissionIllustSortType') === 'popular'
        ? app.$cookie.get('commissionIllustSortType')
        : 'commissionId'
      : 'commissionId'
  )

  // トップ画面の作品リストを初期化
  const initIndexComics = (ctx: SetupContext) => {
    works.value.length = 0
    firestore
      .collection('works')
      .where('release', '==', true)
      .orderBy('official', 'desc')
      .orderBy('popular', 'desc')
      .limit(31)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const tmp = doc.data()
          const subDocRef = await doc.ref.collection('ja').doc('data').get()
          tmp.ja = subDocRef.data()
          works.value.push(tmp)
        })
        ctx.emit('loading-done')
      })
  }

  // 作品一覧の作品リストを初期化
  const initComics = (ctx: SetupContext) => {
    works.value.length = 0
    firestore
      .collection('works')
      .where('release', '==', true)
      .orderBy('official', 'desc')
      .orderBy(sortType.value, 'desc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const tmp = doc.data()
          const subDocRef = await doc.ref.collection('ja').doc('data').get()
          tmp.ja = subDocRef.data()
          works.value.push(tmp)
        })
        ctx.emit('loading-done')
      })
  }

  // お気に入り画面の作品リストを初期化
  const initFavoriteWorks = (ctx: SetupContext) => {
    works.value.length = 0
    favoriteIds.value.length = 0
    firestore
      .collection('usersSecretData')
      .doc(`${user?.user_id}`)
      .collection('favoriteWorks')
      .where('workId', '!=', 0)
      .get()
      .then((favoriteWorksSnapshot) => {
        if (!favoriteWorksSnapshot.empty) {
          favoriteWorksSnapshot.forEach((doc) => {
            favoriteIds.value.unshift(doc.data().workId)
          })
          sliceByNumber(favoriteIds.value, 10).forEach((favoriteIds) => {
            firestore
              .collection('works')
              .where('release', '==', true)
              .where('workId', 'in', favoriteIds)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                  const tmp = doc.data()
                  const subDocRef = await doc.ref.collection('ja').doc('data').get()
                  tmp.ja = subDocRef.data()
                  works.value.push(tmp)
                })
                ctx.emit('loading-done')
              })
          })
        } else {
          ctx.emit('loading-done')
        }
      })
  }

  // トップ画面のコミッションリストを初期化
  const initIndexCommissions = (ctx: SetupContext, commissionType: CommissionType) => {
    commissionsComic.value.length = 0
    commissionsCosplay.value.length = 0
    commissionsAnime.value.length = 0
    commissionsIllust.value.length = 0
    firestore
      .collection('commissions')
      .where('release', '==', true)
      .where('commissionType', '==', commissionType)
      .orderBy('popular', 'desc')
      .limit(9)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const tmp = doc.data()
          const subDocRef = await doc.ref.collection('ja').doc('data').get()
          tmp.ja = subDocRef.data()
          firestore
            .collection('usersPublicData')
            .where('creatorId', '==', tmp.creatorId)
            .get()
            .then((publicSnapshot) => {
              publicSnapshot.forEach((publicDoc) => {
                tmp.displayName = publicDoc.data().displayName
                tmp.picture = publicDoc.data().picture
                if (commissionType === 'comic') {
                  commissionsComic.value.push(tmp)
                } else if (commissionType === 'illust') {
                  commissionsIllust.value.push(tmp)
                } else if (commissionType === 'cosplay') {
                  commissionsCosplay.value.push(tmp)
                } else {
                  commissionsAnime.value.push(tmp)
                }
              })
            })
        })
        ctx.emit('loading-done')
      })
  }

  // コミッション一覧（漫画）を初期化
  const initCommissionsComic = (ctx: SetupContext) => {
    commissionsComic.value.length = 0
    firestore
      .collection('commissions')
      .where('release', '==', true)
      .where('commissionType', '==', 'comic')
      .orderBy(commissionComicSortType.value, 'desc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const tmp = doc.data()
          const subDocRef = await doc.ref.collection('ja').doc('data').get()
          tmp.ja = subDocRef.data()
          firestore
            .collection('usersPublicData')
            .where('creatorId', '==', tmp.creatorId)
            .get()
            .then((publicSnapshot) => {
              publicSnapshot.forEach((publicDoc) => {
                tmp.displayName = publicDoc.data().displayName
                tmp.picture = publicDoc.data().picture
                commissionsComic.value.push(tmp)
              })
            })
        })
        ctx.emit('loading-done')
      })
  }

  // コミッション一覧（コスプレ）を初期化
  const initCommissionsCosplay = (ctx: SetupContext) => {
    commissionsCosplay.value.length = 0
    firestore
      .collection('commissions')
      .where('release', '==', true)
      .where('commissionType', '==', 'cosplay')
      .orderBy(commissionCosplaySortType.value, 'desc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const tmp = doc.data()
          const subDocRef = await doc.ref.collection('ja').doc('data').get()
          tmp.ja = subDocRef.data()
          firestore
            .collection('usersPublicData')
            .where('creatorId', '==', tmp.creatorId)
            .get()
            .then((publicSnapshot) => {
              publicSnapshot.forEach((publicDoc) => {
                tmp.displayName = publicDoc.data().displayName
                tmp.picture = publicDoc.data().picture
                commissionsCosplay.value.push(tmp)
              })
            })
        })
        ctx.emit('loading-done')
      })
  }

  // コミッション一覧（アニメ）を初期化
  const initCommissionsAnime = (ctx: SetupContext) => {
    commissionsAnime.value.length = 0
    firestore
      .collection('commissions')
      .where('release', '==', true)
      .where('commissionType', '==', 'anime')
      .orderBy(commissionAnimeSortType.value, 'desc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const tmp = doc.data()
          const subDocRef = await doc.ref.collection('ja').doc('data').get()
          tmp.ja = subDocRef.data()
          firestore
            .collection('usersPublicData')
            .where('creatorId', '==', tmp.creatorId)
            .get()
            .then((publicSnapshot) => {
              publicSnapshot.forEach((publicDoc) => {
                tmp.displayName = publicDoc.data().displayName
                tmp.picture = publicDoc.data().picture
                commissionsAnime.value.push(tmp)
              })
            })
        })
        ctx.emit('loading-done')
      })
  }

  // コミッション一覧（イラスト）を初期化
  const initCommissionsIllust = (ctx: SetupContext) => {
    commissionsIllust.value.length = 0
    firestore
      .collection('commissions')
      .where('release', '==', true)
      .where('commissionType', '==', 'illust')
      .orderBy(commissionIllustSortType.value, 'desc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          const tmp = doc.data()
          const subDocRef = await doc.ref.collection('ja').doc('data').get()
          tmp.ja = subDocRef.data()
          firestore
            .collection('usersPublicData')
            .where('creatorId', '==', tmp.creatorId)
            .get()
            .then((publicSnapshot) => {
              publicSnapshot.forEach((publicDoc) => {
                tmp.displayName = publicDoc.data().displayName
                tmp.picture = publicDoc.data().picture
                commissionsIllust.value.push(tmp)
              })
            })
        })
        ctx.emit('loading-done')
      })
  }

  // 作品一覧のリストをソート
  const clickSortList = (ctx: SetupContext, sort: string) => {
    app.$cookie.set('sortType', sort, $cookiesOpt)
    sortType.value = app.$cookie.get('sortType')
    initComics(ctx)
  }

  // コミッション一覧のリストをソート
  const clickSortListCommission = (ctx: SetupContext, sort: string, commissionType: string) => {
    if (commissionType === 'comic') {
      app.$cookie.set('commissionComicSortType', sort, $cookiesOpt)
      commissionComicSortType.value = app.$cookie.get('commissionComicSortType')
      initCommissionsComic(ctx)
    } else if (commissionType === 'illust') {
      app.$cookie.set('commissionIllustSortType', sort, $cookiesOpt)
      commissionIllustSortType.value = app.$cookie.get('commissionIllustSortType')
      initCommissionsIllust(ctx)
    } else if (commissionType === 'cosplay') {
      app.$cookie.set('commissionCosplaySortType', sort, $cookiesOpt)
      commissionCosplaySortType.value = app.$cookie.get('commissionCosplaySortType')
      initCommissionsCosplay(ctx)
    } else {
      app.$cookie.set('commissionAnimeSortType', sort, $cookiesOpt)
      commissionAnimeSortType.value = app.$cookie.get('commissionAnimeSortType')
      initCommissionsAnime(ctx)
    }
  }

  return {
    works,
    commissionsComic,
    commissionsCosplay,
    commissionsAnime,
    commissionsIllust,
    sortType,
    commissionComicSortType,
    commissionCosplaySortType,
    commissionAnimeSortType,
    commissionIllustSortType,
    initIndexComics,
    initComics,
    initCommissionsComic,
    initCommissionsCosplay,
    initCommissionsAnime,
    initCommissionsIllust,
    initFavoriteWorks,
    initIndexCommissions,
    clickSortList,
    clickSortListCommission,
  }
}

export type ListStore = ReturnType<typeof useList>
export { useList }
