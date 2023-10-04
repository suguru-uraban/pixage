import { reactive, ref, useContext } from '@nuxtjs/composition-api'
import axios from 'axios'
import firebase, { firestore, storage, timestamp } from '@/plugins/firebase'
import { useValidation } from 'vue-composable'
import { useRule } from '@/compositions/rule'
import { CreatorType } from '@/types/creatorType'
import { CollaboratorType } from '@/types/collaboratorType'
import { getUserFromCookie } from '@/utils/cookieDecode'
import { convertFileSize, convertTimestampForDateTime } from '@/utils/util'

const usePostWork = () => {
  /** composition-api **/
  const { app } = useContext()
  const {
    required,
    notRequired,
    displayNameLength,
    emailFormat,
    workTitleLength,
    workDescriptionLength,
    episodeNumLength,
    episodeTitleLength,
    memoLength,
    requiredUploadFile,
    episodePriceFormat,
  } = useRule()
  /** /composition-api **/

  /** Variables **/
  const user = getUserFromCookie(app.$cookie.get('__session'))
  /** /Variables **/

  // 開発環境かどうかの判定
  const isDevelop = ref<boolean>(false)

  // アップロード中か否かの判定
  const uploading = ref<boolean>(false)

  // 表示名を格納
  const displayName = ref<string>('')

  // メールアドレスを格納
  const email = ref<string>('')

  // 既にメールアドレスを入力しているかの判定
  const hasEmail = ref<boolean>(false)

  // 自身のクリエイター区分を格納
  const isCreator = ref<CreatorType>('all')

  // 自身のクリエイターIDを格納
  const creatorId = ref<number>(0)

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

  // 既存の作品データを格納
  const existingWorks = ref<{ workTitle: string; workDescription: string; genre: string }[]>([])

  // 選択した既存の作品名を格納
  const selectExistingWorkTitle = ref<string>('')

  // 選択した既存の作品データを格納
  const selectExistingWorkData = reactive({
    workTitle: '',
    workDescription: '',
    genre: '',
  })

  // 話数を格納
  const episodeNum = ref<string>('')

  // サブタイトルを格納
  const episodeTitle = ref<string>('')

  // 希望レンタル価格を格納
  const episodePrice = ref<string | null>(null)

  // 希望レンタル価格が入力可能かどうかの判定
  const canInputPrice = ref<boolean>(false)

  // 補足を格納
  const memo = ref<string>('')

  // アップロードコンポーネントを格納
  const upload = ref()

  // アップロードの進行状態を格納
  const progress = ref<number>(0)

  // アップロードするファイルを格納
  const files = ref<any[]>([])

  // アップロード時のバリデーションメッセージ
  const uploadError = ref<string>('')

  // アップロード完了時の判定
  const uploadSuccess = ref<boolean>(false)

  // アップロード完了時の判定
  const uploadFinishMessage = ref<string>('')

  // その項目を入力・変更したかの判定（バリデーションで使用）
  const isDirty = reactive({
    email: false,
    collaborator: false,
    workTitle: false,
    workDescription: false,
    genre: false,
    selectExistingWorkTitle: false,
    episodeNum: false,
    episodeTitle: false,
    episodePrice: false,
    memo: false,
    files: false,
  })

  // 作品投稿のバリデーション
  const params = useValidation({
    email: {
      $value: email,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.emailIsRequired'),
      },
      format: {
        $validator: emailFormat,
        $message: app.i18n.t('validate.emailFormatIsInValid'),
      },
    },
    episodeNum: {
      $value: episodeNum,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.episodeNumIsRequired'),
      },
      format: {
        $validator: episodeNumLength,
        $message: app.i18n.t('validate.episodeNumFormatIsInValid'),
      },
    },
    episodeTitle: {
      $value: episodeTitle,
      format: {
        $validator: episodeTitleLength,
        $message: app.i18n.t('validate.episodeTitleFormatIsInValid'),
      },
    },
    episodePrice: {
      $value: episodePrice,
      format: {
        $validator: episodePriceFormat,
        $message: app.i18n.t('validate.episodePriceFormatIsInValid'),
      },
    },
    memo: {
      $value: memo,
      format: {
        $validator: memoLength,
        $message: app.i18n.t('validate.memoFormatIsInValid'),
      },
    },
    files: {
      $value: files,
      required: {
        $validator: requiredUploadFile,
        $message: app.i18n.t('validate.uploadFileIsRequired'),
      },
    },
  })

  // 共同作業者用の初期バリデーションを格納
  const collaboratorParams = ref(
    useValidation({
      $value: collaborator,
      required: {
        $validator: notRequired,
        $message: app.i18n.t('validate.collaboratorIsRequired'),
      },
      format: {
        $validator: displayNameLength,
        $message: app.i18n.t('validate.collaboratorFormatIsInValid'),
      },
    })
  )

  // 作品の初期バリデーションを格納
  const workParams = ref(
    useValidation({
      workTitle: {
        $value: workTitle,
        required: {
          $validator: required,
          $message: app.i18n.t('validate.workTitleIsRequired'),
        },
        format: {
          $validator: workTitleLength,
          $message: app.i18n.t('validate.workTitleFormatIsInValid'),
        },
      },
      workDescription: {
        $value: workDescription,
        required: {
          $validator: required,
          $message: app.i18n.t('validate.workDescriptionIsRequired'),
        },
        format: {
          $validator: workDescriptionLength,
          $message: app.i18n.t('validate.workDescriptionFormatIsInValid'),
        },
      },
      genre: {
        $value: genre,
        required: {
          $validator: required,
          $message: app.i18n.t('validate.genreIsRequired'),
        },
      },
      selectExistingWorkTitle: {
        $value: selectExistingWorkTitle,
        required: {
          $validator: notRequired,
          $message: app.i18n.t('validate.selectExistingWorkTitleIsRequired'),
        },
      },
    })
  )

  // 作品投稿を初期化
  const initPostWorks = async () => {
    existingWorks.value = []
    canInputPrice.value = false
    await firestore
      .doc(`usersPublicData/${user?.user_id}`)
      .get()
      .then((res) => {
        displayName.value = res.data()?.displayName
        isCreator.value = res.data()?.isCreator
        creatorId.value = res.data()?.creatorId
        firestore
          .collection('works')
          .where('searchCreatorId', 'array-contains', creatorId.value)
          .get()
          .then((snapshot) => {
            snapshot.forEach(async (doc) => {
              await doc.ref
                .collection('ja')
                .doc('data')
                .get()
                .then((subDoc) => {
                  const workData = {
                    workTitle: subDoc.data()?.workTitle,
                    workDescription: subDoc.data()?.workDescription,
                    genre: subDoc.data()?.genre,
                  }
                  existingWorks.value.push(workData)
                })
            })
          })
      })
    await firestore
      .doc(`usersSecretData/${user?.user_id}`)
      .get()
      .then(async (res) => {
        const receivableAccountDoc = await res.ref.collection('receivableAccount').doc('data').get()
        email.value = res.data()?.email
        if (res.data()?.email) {
          hasEmail.value = true
        }
        canInputPrice.value = receivableAccountDoc.exists
      })
    if (isCreator.value === 'storyOnly') {
      isCreatorForCollaborator.value = 'drawingOnly'
    } else if (isCreator.value === 'drawingOnly') {
      isCreatorForCollaborator.value = 'storyOnly'
    } else {
      isCreatorForCollaborator.value = 'notCollaborator'
    }
    collaborator.value = ''
    isExisting.value = false
    workTitle.value = ''
    workDescription.value = ''
    genre.value = ''
    selectExistingWorkTitle.value = ''
    selectExistingWorkData.workTitle = ''
    selectExistingWorkData.workDescription = ''
    selectExistingWorkData.genre = ''
    episodeNum.value = ''
    episodeTitle.value = ''
    episodePrice.value = null
    memo.value = ''
    uploadSuccess.value = false
    uploadFinishMessage.value = ''
  }

  // 共同作業者用の切り替えとバリデーション
  const toggleCollaborator = () => {
    collaboratorParams.value = useValidation({
      $value: collaborator,
      required: {
        $validator: isCreatorForCollaborator.value !== 'notCollaborator' ? required : notRequired,
        $message: app.i18n.t('validate.collaboratorIsRequired'),
      },
      format: {
        $validator: displayNameLength,
        $message: app.i18n.t('validate.collaboratorFormatIsInValid'),
      },
    })
  }

  // 作品用の切り替えとバリデーション
  const toggleWork = () => {
    isExisting.value = !isExisting.value
    episodePrice.value = null
    workParams.value = useValidation({
      workTitle: {
        $value: workTitle,
        required: {
          $validator: isExisting.value ? notRequired : required,
          $message: app.i18n.t('validate.workTitleIsRequired'),
        },
        format: {
          $validator: workTitleLength,
          $message: app.i18n.t('validate.workTitleFormatIsInValid'),
        },
      },
      workDescription: {
        $value: workDescription,
        required: {
          $validator: !isExisting.value ? required : notRequired,
          $message: app.i18n.t('validate.workDescriptionIsRequired'),
        },
        format: {
          $validator: workDescriptionLength,
          $message: app.i18n.t('validate.workDescriptionFormatIsInValid'),
        },
      },
      genre: {
        $value: genre,
        required: {
          $validator: !isExisting.value ? required : notRequired,
          $message: app.i18n.t('validate.genreIsRequired'),
        },
      },
      selectExistingWorkTitle: {
        $value: selectExistingWorkTitle,
        required: {
          $validator: !isExisting.value ? notRequired : required,
          $message: app.i18n.t('validate.selectExistingWorkTitleIsRequired'),
        },
      },
    })
  }

  // 既存の作品を選択したらその作品のworkTitle、workDescription、genreを格納
  const choiceExistingWorkData = (workTitle: string) => {
    const choiceData = existingWorks.value.find((existingWork) => {
      return existingWork.workTitle === workTitle
    })
    selectExistingWorkData.workTitle = choiceData ? choiceData.workTitle : ''
    selectExistingWorkData.workDescription = choiceData ? choiceData.workDescription : ''
    selectExistingWorkData.genre = choiceData ? choiceData.genre : ''
  }

  // アップロード時のバリデーション
  const uploadValidation = (value: any[]) => {
    if (upload.value) {
      if (value.length > 1) {
        files.value.length = 0
        uploadError.value = app.i18n.t('postWork.validate1').toString()
      } else if (
        value[0].type !== 'application/zip' &&
        value[0].type !== 'application/x-zip-compressed'
      ) {
        files.value.length = 0
        uploadError.value = app.i18n.t('postWork.validate2').toString()
      } else if (value[0].size > 209715200) {
        files.value.length = 0
        uploadError.value = app.i18n.t('postWork.validate3').toString()
      } else if (value[0].name.normalize().length > 54) {
        files.value.length = 0
        uploadError.value = app.i18n.t('postWork.validate4').toString()
      } else {
        files.value = value
        uploadError.value = ''
      }
    }
  }

  // アップロードファイルを削除する
  const uploadDelete = () => {
    files.value = []
  }

  // バリデーションにかからなければ投稿するデータを送信
  const clickSendPostWork = async () => {
    if (
      !params.$anyInvalid &&
      !collaboratorParams.value.$anyInvalid &&
      !workParams.value.$anyInvalid
    ) {
      uploading.value = true
      await firestore
        .doc(`usersPublicData/${user?.user_id}`)
        .get()
        .then((res) => {
          displayName.value = res.data()?.displayName
        })
      const batch = firestore.batch()
      const postWorkRef = firestore.collection('postWork').doc()
      const newPostWorkId = postWorkRef.id
      const storageWorksRef = storage.ref('postWork')
      const fileName = `${convertTimestampForDateTime(firebase.firestore.Timestamp.now())}.zip`
      batch.set(postWorkRef, {
        displayName: displayName.value,
        email: email.value,
        isCreator: isCreator.value,
        creatorId: creatorId.value,
        isCreatorForCollaborator: isCreatorForCollaborator.value,
        collaborator: collaborator.value,
        isExisting: isExisting.value,
        workTitle: isExisting.value ? selectExistingWorkData.workTitle : workTitle.value,
        workDescription: isExisting.value
          ? selectExistingWorkData.workDescription
          : workDescription.value,
        genre: isExisting.value ? selectExistingWorkData.genre : genre.value,
        episodeNum: episodeNum.value,
        episodeTitle: episodeTitle.value,
        episodePrice:
          episodePrice.value === '' || episodePrice.value === null ? 0 : Number(episodePrice.value),
        currency: '¥',
        memo: memo.value,
        fileName,
        fileSize: convertFileSize(files.value[0].size),
        fileUrl: '',
        uid: newPostWorkId,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      batch.commit().then(() => {
        const file = files.value[0].file
        const postWorkFileRef = storageWorksRef.child(`${newPostWorkId}/${fileName}`)
        const uploadTask = postWorkFileRef.put(file)
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            progress.value = Number(percent.toFixed())
          },
          () => {
            uploadFinishMessage.value = app.$t('postWork.uploadError').toString()
            progress.value = 100
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              firestore
                .doc(`postWork/${newPostWorkId}`)
                .update({
                  fileUrl: url,
                  updatedAt: timestamp,
                })
                .then(() => {
                  axios({
                    baseURL: isDevelop.value
                      ? 'https://asia-northeast1-pixage-app-development.cloudfunctions.net/postWorkNotification'
                      : 'https://asia-northeast1-pixage-app.cloudfunctions.net/postWorkNotification',
                    method: 'post',
                    params: {
                      title: isExisting.value ? selectExistingWorkData.workTitle : workTitle.value,
                      name: displayName.value,
                      genre: isExisting.value ? selectExistingWorkData.genre : genre.value,
                      isExisting: isExisting.value ? '既存' : '新規',
                      episodeNum: episodeNum.value,
                      currency: '¥',
                      episodePrice:
                        episodePrice.value === '' || episodePrice.value === null
                          ? '0'
                          : Number(episodePrice.value).toLocaleString(),
                    },
                  }).then(async () => {
                    await initPostWorks()
                    uploading.value = false
                    uploadSuccess.value = true
                  })
                })
            })
          }
        )
      })
    } else {
      if (params.email.$anyInvalid) isDirty.email = true
      if (collaboratorParams.value.$anyInvalid) isDirty.collaborator = true
      if (workParams.value.workTitle.$anyInvalid) isDirty.workTitle = true
      if (workParams.value.workDescription.$anyInvalid) isDirty.workDescription = true
      if (workParams.value.genre.$anyInvalid) isDirty.genre = true
      if (workParams.value.selectExistingWorkTitle.$anyInvalid)
        isDirty.selectExistingWorkTitle = true
      if (params.episodeNum.$anyInvalid) isDirty.episodeNum = true
      if (params.episodeTitle.$anyInvalid) isDirty.episodeTitle = true
      if (params.episodePrice.$anyInvalid) isDirty.episodePrice = true
      if (params.memo.$anyInvalid) isDirty.memo = true
      if (params.files.$anyInvalid) isDirty.files = true
      return await params.$touch()
    }
  }

  return {
    isDevelop,
    uploading,
    email,
    hasEmail,
    isCreatorForCollaborator,
    collaborator,
    isExisting,
    workTitle,
    workDescription,
    genre,
    existingWorks,
    selectExistingWorkTitle,
    episodeNum,
    episodeTitle,
    episodePrice,
    canInputPrice,
    memo,
    upload,
    progress,
    files,
    uploadError,
    uploadSuccess,
    uploadFinishMessage,
    isDirty,
    params,
    collaboratorParams,
    workParams,
    initPostWorks,
    toggleCollaborator,
    toggleWork,
    choiceExistingWorkData,
    uploadValidation,
    uploadDelete,
    clickSendPostWork,
  }
}

export type PostWorkStore = ReturnType<typeof usePostWork>
export { usePostWork }
