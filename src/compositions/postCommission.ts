import { reactive, ref, useContext } from '@nuxtjs/composition-api'
import axios from 'axios'
import firebase, { firestore, storage, timestamp } from '@/plugins/firebase'
import { useValidation } from 'vue-composable'
import { useRule } from '@/compositions/rule'
import { CommissionType } from '@/types/commissionType'
import { getUserFromCookie } from '@/utils/cookieDecode'

const usePostCommission = () => {
  /** composition-api **/
  const { app } = useContext()
  const {
    required,
    emailFormat,
    commissionTitleLength,
    commissionPriceFormat,
    commissionDescriptionLength,
  } = useRule()
  /** /composition-api **/

  /** Variables **/
  const user = getUserFromCookie(app.$cookie.get('__session'))
  /** /Variables **/

  // 開発環境かどうかの判定
  const isDevelop = ref<boolean>(false)

  // 通信中か否かの判定
  const processing = ref<boolean>(false)

  // メールアドレスを格納
  const email = ref<string>('')

  // 既にメールアドレスを入力しているかの判定
  const hasEmail = ref<boolean>(false)

  // 自身のクリエイターIDを格納
  const creatorId = ref<number>(0)

  // コミッションのタイトルを格納
  const commissionTitle = ref<string>('')

  // コミッションの種類を格納
  const commissionType = ref<CommissionType>('')

  // コミッションの金額を格納
  const commissionPrice = ref<string | null>(null)

  // コミッションの概要を格納
  const commissionDescription = ref<string>('')

  // 予定納期を格納
  const workPeriod = ref<number | null>(null)

  // リクエスト詳細記入が可能かの判定
  const acceptDetail = ref<boolean>(true)

  // 作風ファイルの格納先
  const imageFiles = ref<File[] | null>(null)

  // 作風ファイルアップロード時のエラーメッセージを格納
  const imageFilesErrorMessage = ref<string>('')

  // データが送られたかの判定
  const isCompleted = ref<boolean>(false)

  // 選択された画像ファイルの参照元を格納（Image）
  const myVueUploadDropImagesRef = ref<any>()

  // その項目を入力・変更したかの判定（バリデーションで使用）
  const isDirty = reactive({
    email: false,
    commissionTitle: false,
    commissionType: false,
    commissionPrice: false,
    commissionDescription: false,
    workPeriod: false,
  })

  // コミッション作成のバリデーション
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
    commissionTitle: {
      $value: commissionTitle,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.commissionTitleIsRequired'),
      },
      format: {
        $validator: commissionTitleLength,
        $message: app.i18n.t('validate.commissionTitleFormatIsInValid'),
      },
    },
    commissionType: {
      $value: commissionType,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.commissionTypeIsRequired'),
      },
    },
    commissionPrice: {
      $value: commissionPrice,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.commissionPriceIsRequired'),
      },
      format: {
        $validator: commissionPriceFormat,
        $message: app.i18n.t('validate.commissionPriceFormatIsInValid'),
      },
    },
    commissionDescription: {
      $value: commissionDescription,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.commissionDescriptionIsRequired'),
      },
      format: {
        $validator: commissionDescriptionLength,
        $message: app.i18n.t('validate.commissionDescriptionFormatIsInValid'),
      },
    },
    workPeriod: {
      $value: workPeriod,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.commissionWorkPeriodIsRequired'),
      },
    },
  })

  // コミッション作成を初期化
  const initPostCommission = async () => {
    await firestore
      .doc(`usersPublicData/${user?.user_id}`)
      .get()
      .then((res) => {
        creatorId.value = res.data()?.creatorId
      })
    await firestore
      .doc(`usersSecretData/${user?.user_id}`)
      .get()
      .then((res) => {
        email.value = res.data()?.email
        if (res.data()?.email) {
          hasEmail.value = true
        }
      })
    commissionTitle.value = ''
    commissionType.value = ''
    commissionPrice.value = null
    commissionDescription.value = ''
    workPeriod.value = null
    acceptDetail.value = true
    imageFiles.value = null
    imageFilesErrorMessage.value = ''
  }

  // 選択された原稿ファイルを格納
  const addFile = (files: File[]) => {
    imageFiles.value = files
  }

  // バリデーションに引っかかった場合のエラーメッセージを格納
  const handleImageValidate = (message: string) => {
    imageFilesErrorMessage.value = message
  }

  // 選択された原稿を一括削除する
  const handleImageNull = () => {
    imageFiles.value = null
  }

  // バリデーションにかからなければコミッションのデータを送信
  const clickSendPostCommission = async () => {
    if (!params.$anyInvalid) {
      processing.value = true
      let prevSerialNumber = 0
      const batch = firestore.batch()
      const commissionsCountRef = firestore.collection('commissionsCount').doc('global')
      const commissionsCount = await commissionsCountRef.get()
      const commissionsRef = firestore.collection('commissions').doc()
      const newPostCommissionId = commissionsRef.id
      const commissionDataRef = firestore
        .collection('commissions')
        .doc(commissionsRef.id)
        .collection('ja')
        .doc('data')
      const storageCommissionsRef = storage.ref('commissions')
      if (!commissionsCount.exists) {
        prevSerialNumber = 0
        batch.set(commissionsCountRef, {
          count: firebase.firestore.FieldValue.increment(1),
          serialNumber: firebase.firestore.FieldValue.increment(1),
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      } else {
        prevSerialNumber = commissionsCount.data()?.serialNumber
        batch.update(commissionsCountRef, {
          count: firebase.firestore.FieldValue.increment(1),
          serialNumber: firebase.firestore.FieldValue.increment(1),
          updatedAt: timestamp,
        })
      }
      batch.set(commissionsRef, {
        email: email.value,
        creatorId: creatorId.value,
        commissionId: prevSerialNumber + 1,
        commissionType: commissionType.value,
        approval: false,
        release: false,
        favorite: 0,
        like: 0,
        popular: 0,
        requestCount: 0,
        uid: newPostCommissionId,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      batch.set(commissionDataRef, {
        commissionTitle: commissionTitle.value,
        commissionPrice: Number(commissionPrice.value),
        currency: '¥',
        commissionDescription: commissionDescription.value,
        workPeriod: Number(workPeriod.value),
        acceptDetail: acceptDetail.value,
        images: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      batch.commit().then(() => {
        if (imageFiles.value?.length) {
          const images: string[] = []
          let loopCount = 0
          imageFiles.value?.forEach(async (imageFile, index) => {
            let fileType = ''
            if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
              fileType = '.jpg'
            } else if (imageFile.type === 'image/png') {
              fileType = '.png'
            }
            const path = `${newPostCommissionId}/${index + 1}${fileType}`
            const imageRef = storageCommissionsRef.child(path)
            await imageRef.put(imageFile)
            imageRef.getDownloadURL().then((url: string) => {
              images[index] = url
              loopCount += 1
              if (imageFiles.value && loopCount === imageFiles.value?.length) {
                commissionDataRef
                  .update({
                    images,
                    updatedAt: timestamp,
                  })
                  .then(() => {
                    axios({
                      baseURL: isDevelop.value
                        ? 'https://asia-northeast1-pixage-app-development.cloudfunctions.net/commissionNewNotification'
                        : 'https://asia-northeast1-pixage-app.cloudfunctions.net/commissionNewNotification',
                      method: 'post',
                      params: {
                        title: commissionTitle.value,
                        type: commissionType.value,
                      },
                    }).then(() => {
                      isCompleted.value = true
                      processing.value = false
                      email.value = ''
                      hasEmail.value = false
                      commissionTitle.value = ''
                      commissionType.value = ''
                      commissionPrice.value = null
                      commissionDescription.value = ''
                      workPeriod.value = null
                      acceptDetail.value = true
                    })
                  })
              }
            })
          })
        } else {
          axios({
            baseURL: isDevelop.value
              ? 'https://asia-northeast1-pixage-app-development.cloudfunctions.net/commissionNewNotification'
              : 'https://asia-northeast1-pixage-app.cloudfunctions.net/commissionNewNotification',
            method: 'post',
            params: {
              title: commissionTitle.value,
              type: commissionType.value,
            },
          }).then(() => {
            isCompleted.value = true
            processing.value = false
            email.value = ''
            hasEmail.value = false
            commissionTitle.value = ''
            commissionType.value = ''
            commissionPrice.value = null
            commissionDescription.value = ''
            workPeriod.value = null
            acceptDetail.value = true
          })
        }
      })
    } else {
      if (params.email.$anyInvalid) isDirty.email = true
      if (params.commissionTitle.$anyInvalid) isDirty.commissionTitle = true
      if (params.commissionType.$anyInvalid) isDirty.commissionType = true
      if (params.commissionPrice.$anyInvalid) isDirty.commissionPrice = true
      if (params.commissionDescription.$anyInvalid) isDirty.commissionDescription = true
      if (params.workPeriod.$anyInvalid) isDirty.workPeriod = true
      return await params.$touch()
    }
  }

  /** Inner Component(Image) **/
  // image/jpeg以外は弾くバリデーション
  const validateType = (files: File[]) => {
    return files.every(
      (file) => file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
    )
  }

  // 500KBより大きい画像は弾くバリデーション
  const validateSize = (files: File[]) => {
    return files.every((file) => file.size <= 512000)
  }

  // バリデーションが全て通ったら画像を格納
  const handleImage = (files: File[]) => {
    imageFilesErrorMessage.value = ''
    if (files.length > 2) {
      myVueUploadDropImagesRef.value.reset()
      handleImageValidate(app.i18n.t('postCommissionImages.validate1').toString())
      handleImageNull()
    } else if (!validateType(files)) {
      myVueUploadDropImagesRef.value.reset()
      handleImageValidate(app.i18n.t('postCommissionImages.validate2').toString())
      handleImageNull()
    } else if (!validateSize(files)) {
      myVueUploadDropImagesRef.value.reset()
      handleImageValidate(app.i18n.t('postCommissionImages.validate3').toString())
      handleImageNull()
    } else {
      addFile(files)
    }
  }
  /** /Inner Component(Image) **/

  return {
    isDevelop,
    processing,
    email,
    hasEmail,
    creatorId,
    commissionTitle,
    commissionType,
    commissionPrice,
    commissionDescription,
    workPeriod,
    acceptDetail,
    imageFiles,
    imageFilesErrorMessage,
    isCompleted,
    myVueUploadDropImagesRef,
    isDirty,
    params,
    initPostCommission,
    addFile,
    handleImageValidate,
    handleImageNull,
    clickSendPostCommission,
    handleImage,
  }
}

export type PostCommissionStore = ReturnType<typeof usePostCommission>
export { usePostCommission }
