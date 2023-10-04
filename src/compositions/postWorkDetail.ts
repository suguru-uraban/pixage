import { ref, useContext } from '@nuxtjs/composition-api'
import firebase, { firestore, storage, timestamp } from '@/plugins/firebase'
import { CreatorType } from '@/types/creatorType'
import { CollaboratorType } from '@/types/collaboratorType'
import { getUserFromCookie } from '@/utils/cookieDecode'

const usePostWorkDetail = () => {
  /** composition-api **/
  const { app } = useContext()
  /** /composition-api **/

  // 現在のユーザーをcookieから取得
  const user = getUserFromCookie(app.$cookie.get('__session'))

  // スタッフのメールアドレスを格納
  const adminEmail = ref<string>('')

  // 表示名を格納
  const displayName = ref<string>('')

  // メールアドレスを格納
  const email = ref<string>('')

  // 自身のクリエイター区分を格納
  const isCreator = ref<CreatorType>('all')

  // 共同作業者の区分を格納
  const isCreatorForCollaborator = ref<CollaboratorType>('notCollaborator')

  // 共同作業者の表示名を格納
  const collaborator = ref<string>('')

  // 既存の作品を使うかの判定
  const isExisting = ref<boolean>(false)

  // 作品名を格納
  const workTitle = ref<string>('')

  // 作品概要を格納
  const workDescription = ref<string>('')

  // ジャンルを格納
  const genre = ref<string>('')

  // 話数を格納
  const episodeNum = ref<string>('')

  // サブタイトルを格納
  const episodeTitle = ref<string>('')

  // サブタイトルを格納
  const episodePrice = ref<number>(0)

  // 通貨の種類を格納
  const currency = ref<string>('')

  // 補足を格納
  const memo = ref<string>('')

  // ファイル名を格納
  const fileName = ref<string>('')

  // ファイルサイズを格納
  const fileSize = ref<string>('')

  // ファイルURLを格納
  const fileUlr = ref<string>('')

  // ダウンロードログの格納先
  const downloadLogs = ref<firebase.firestore.DocumentData[]>([])

  // 削除ログの格納先
  const deleteLogs = ref<firebase.firestore.DocumentData[]>([])

  // ユーザーの初期呼び出し
  const initDetailPostWork = (id: string) => {
    downloadLogs.value = []
    deleteLogs.value = []
    firestore
      .doc(`postWork/${id}`)
      .get()
      .then(async (doc) => {
        const tmp = doc.data()
        await doc.ref
          .collection('download')
          .get()
          .then((downloadSnapshot) => {
            if (!downloadSnapshot.empty) {
              downloadSnapshot.forEach((downloadDocs) => {
                downloadLogs.value.push(downloadDocs.data())
              })
            }
          })
        await doc.ref
          .collection('delete')
          .get()
          .then((deleteSnapshot) => {
            if (!deleteSnapshot.empty) {
              deleteSnapshot.forEach((deleteDocs) => {
                deleteLogs.value.push(deleteDocs.data())
              })
            }
          })
        displayName.value = tmp?.displayName
        email.value = tmp?.email
        isCreator.value = tmp?.isCreator
        isCreatorForCollaborator.value = tmp?.isCreatorForCollaborator
        collaborator.value = tmp?.collaborator
        isExisting.value = tmp?.isExisting
        workTitle.value = tmp?.workTitle
        workDescription.value = tmp?.workDescription
        genre.value = tmp?.genre
        episodeNum.value = tmp?.episodeNum
        episodeTitle.value = tmp?.episodeTitle
        episodePrice.value = tmp?.episodePrice
        currency.value = tmp?.currency
        memo.value = tmp?.memo
        fileName.value = tmp?.fileName
        fileSize.value = tmp?.fileSize
        fileUlr.value = tmp?.fileUrl
      })
  }

  // ダウンロードのログを追加
  const updateDownloadLog = (id: string) => {
    firestore
      .doc(`usersSecretData/${user?.user_id}`)
      .get()
      .then((doc) => {
        adminEmail.value = doc.data()?.email
        const batch = firestore.batch()
        const postWorkSubRef = firestore.collection('postWork').doc(id).collection('download').doc()
        batch.set(postWorkSubRef, {
          adminEmail: adminEmail.value,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        batch.commit().then(() => {
          initDetailPostWork(id)
        })
      })
  }

  // 削除のログを追加後、storageからファイルを削除
  const updateDeleteLog = (id: string) => {
    firestore
      .doc(`usersSecretData/${user?.user_id}`)
      .get()
      .then((doc) => {
        adminEmail.value = doc.data()?.email
        const batch = firestore.batch()
        const postWorkSubRef = firestore.collection('postWork').doc(id).collection('delete').doc()
        const storagePostWorkRef = storage.ref().child(`postWork/${id}/${fileName.value}`)
        batch.set(postWorkSubRef, {
          adminEmail: adminEmail.value,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        batch.commit().then(() => {
          // const path = `${id}%2F${fileName.value}`
          // const fileRef = storagePostWorkRef.child(path)
          storagePostWorkRef.delete().then(() => {
            initDetailPostWork(id)
          })
        })
      })
  }

  return {
    displayName,
    email,
    isCreator,
    isCreatorForCollaborator,
    collaborator,
    isExisting,
    workTitle,
    workDescription,
    genre,
    episodeNum,
    episodeTitle,
    episodePrice,
    currency,
    memo,
    fileName,
    fileSize,
    fileUlr,
    downloadLogs,
    deleteLogs,
    initDetailPostWork,
    updateDownloadLog,
    updateDeleteLog,
  }
}

export type PostWorkDetailStore = ReturnType<typeof usePostWorkDetail>
export { usePostWorkDetail }
