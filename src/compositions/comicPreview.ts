import { ref, SetupContext, useContext } from '@nuxtjs/composition-api'
import firebase, { firestore, timestamp } from '@/plugins/firebase'
import { getUserFromCookie } from '@/utils/cookieDecode'

const useComicPreview = () => {
  /** composition-api **/
  const { app } = useContext()
  /** /composition-api **/

  // 現在のユーザーをcookieから取得
  const user = getUserFromCookie(app.$cookie.get('__session'))

  // いいねを押してから完了までの判定
  const comicProcessing = ref<boolean>(false)

  // 作品のUIDを格納
  const workUid = ref<string>('')

  // いいねを押しているかどうかの判定
  const isLike = ref<boolean>(false)

  // 拡大率を格納
  const isZoom = ref<number | null>(null)

  // 拡大する画像を格納
  const zoomImage = ref<string | null>(null)

  // コミックプレビューの初期化
  const initComic = (workId: number, episodeId: number) => {
    isZoom.value = null
    zoomImage.value = null
    firestore
      .doc(`usersSecretData/${user?.user_id}`)
      .collection('likes')
      .where('workId', '==', workId)
      .where('episodeId', '==', episodeId)
      .get()
      .then((likeSnapshot) => {
        isLike.value = !likeSnapshot.empty
      })
  }

  // いいねボタンを押したときの挙動
  const makeItLike = async (workId: number, episodeId: number, ctx: SetupContext) => {
    if (!comicProcessing.value && user) {
      comicProcessing.value = true
      await firestore
        .collection('works')
        .where('workId', '==', workId)
        .get()
        .then((workSnapshot) => {
          workSnapshot.forEach((doc) => {
            workUid.value = doc.id
          })
        })
      const batch = firestore.batch()
      const likeRef = firestore.doc(`usersSecretData/${user.user_id}`).collection('likes').doc()
      const workRef = firestore.doc(`works/${workUid.value}`)
      const episodeRef = firestore.doc(`works/${workUid.value}/ja/data/episode/${episodeId}`)
      batch.set(likeRef, {
        workId,
        episodeId,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      batch.update(workRef, {
        totalLike: firebase.firestore.FieldValue.increment(1),
        popular: firebase.firestore.FieldValue.increment(1),
        updatedAt: timestamp,
      })
      batch.update(episodeRef, {
        like: firebase.firestore.FieldValue.increment(1),
        updatedAt: timestamp,
      })
      batch.commit().then(() => {
        isLike.value = true
        comicProcessing.value = false
        ctx.emit('reload')
      })
    }
  }

  // 拡大の操作
  const handleZoom = (zoom: number | null, image: string | null) => {
    isZoom.value = zoom
    zoomImage.value = image
  }

  return {
    isLike,
    isZoom,
    zoomImage,
    initComic,
    makeItLike,
    handleZoom,
  }
}

export type ComicPreviewStore = ReturnType<typeof useComicPreview>
export { useComicPreview }
