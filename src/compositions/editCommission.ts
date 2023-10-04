import { reactive, ref, useContext } from '@nuxtjs/composition-api'
import axios from 'axios'
import { firestore, storage, timestamp } from '@/plugins/firebase'
import { useValidation } from 'vue-composable'
import { useRule } from '@/compositions/rule'
import { CommissionType } from '@/types/commissionType'

const useEditCommission = () => {
  /** composition-api **/
  const { app } = useContext()
  const { required, commissionTitleLength, commissionPriceFormat, commissionDescriptionLength } =
    useRule()
  /** /composition-api **/

  // 開発環境かどうかの判定
  const isDevelop = ref<boolean>(false)

  // モーダルが開いているかの判定
  const isOpen = ref<boolean>(false)

  // 通信中か否かの判定
  const processing = ref<boolean>(false)

  // 自身のuidを格納
  const uid = ref<string>('')

  // コミッションIDを格納
  const commissionId = ref<number>(0)

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

  // 作風データの格納先
  const currentImages = ref<string[]>([])

  // 選択された画像ファイルの参照元を格納（Image）
  const myVueUploadDropImagesRef = ref<any>()

  // 削除された画像のファイル名を格納
  const imageNames = ref<string[]>([])

  // その項目を入力・変更したかの判定（バリデーションで使用）
  const isDirty = reactive({
    commissionTitle: false,
    commissionType: false,
    commissionPrice: false,
    commissionDescription: false,
    workPeriod: false,
  })

  // コミッション編集のバリデーション
  const params = useValidation({
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

  // コミッション編集を初期化
  const initEditCommission = (id: number) => {
    isOpen.value = true
    commissionId.value = id
    firestore
      .collection('commissions')
      .where('commissionId', '==', id)
      .get()
      .then((commissionSnapshot) => {
        commissionSnapshot.forEach(async (commissionDoc) => {
          const tmp = commissionDoc.data()
          const subDoc = await commissionDoc.ref.collection('ja').doc('data').get()
          tmp.ja = subDoc.data()
          uid.value = tmp.uid
          commissionTitle.value = tmp.ja.commissionTitle
          commissionType.value = tmp.commissionType
          commissionPrice.value = tmp.ja.commissionPrice
          commissionDescription.value = tmp.ja.commissionDescription
          workPeriod.value = tmp.ja.workPeriod
          acceptDetail.value = tmp.ja.acceptDetail
          imageFiles.value = null
          imageFilesErrorMessage.value = ''
          currentImages.value = tmp.ja.images
          imageNames.value = []
          currentImages.value.forEach((image) => {
            if (image.includes('1.')) {
              imageNames.value.push('1')
            } else if (image.includes('2.')) {
              imageNames.value.push('2')
            }
          })
        })
      })
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

  // 現在アップロードされている画像を削除する
  const deleteImage = (index: number) => {
    const getDeleteFileType = () => {
      if (currentImages.value[index].includes('.jpg')) {
        return '.jpg'
      } else if (currentImages.value[index].includes('.png')) {
        return '.png'
      }
    }
    const storageCommissionsRef = storage.ref('commissions')
    const deleteRef = storageCommissionsRef.child(
      `${uid.value}/${imageNames.value[index]}${getDeleteFileType()}`
    )
    deleteRef.delete().then(() => {
      firestore
        .collection('commissions')
        .doc(uid.value)
        .collection('ja')
        .doc('data')
        .update({
          images: currentImages.value.filter(
            (image) => !image.includes(`${imageNames.value[index]}${getDeleteFileType()}`)
          ),
          updatedAt: timestamp,
        })
        .then(() => {
          initEditCommission(commissionId.value)
        })
    })
  }

  // バリデーションにかからなければコミッションのデータを送信
  const clickSendEditCommission = async () => {
    if (!params.$anyInvalid) {
      processing.value = true
      const batch = firestore.batch()
      const commissionsRef = firestore.collection('commissions').doc(uid.value)
      const commissionDataRef = firestore
        .collection('commissions')
        .doc(uid.value)
        .collection('ja')
        .doc('data')
      const storageCommissionsRef = storage.ref('commissions')
      batch.update(commissionsRef, {
        commissionType: commissionType.value,
        approval: false,
        release: false,
        updatedAt: timestamp,
      })
      batch.update(commissionDataRef, {
        commissionTitle: commissionTitle.value,
        commissionPrice: Number(commissionPrice.value),
        commissionDescription: commissionDescription.value,
        workPeriod: Number(workPeriod.value),
        acceptDetail: acceptDetail.value,
        images: currentImages.value,
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
            const path = imageNames.value.length
              ? `${uid.value}/${imageNames.value[index] === '1' ? '2' : '1'}${fileType}`
              : `${uid.value}/${index + 1}${fileType}`
            const imageRef = storageCommissionsRef.child(path)
            await imageRef.put(imageFile)
            imageRef.getDownloadURL().then((url: string) => {
              images[index] = url
              loopCount += 1
              if (imageFiles.value && loopCount === imageFiles.value?.length) {
                commissionDataRef
                  .update({
                    images: imageNames.value.length ? currentImages.value.concat(images) : images,
                    updatedAt: timestamp,
                  })
                  .then(() => {
                    axios({
                      baseURL: isDevelop.value
                        ? 'https://asia-northeast1-pixage-app-development.cloudfunctions.net/commissionEditNotification'
                        : 'https://asia-northeast1-pixage-app.cloudfunctions.net/commissionEditNotification',
                      method: 'post',
                      params: {
                        title: commissionTitle.value,
                        type: commissionType.value,
                      },
                    }).then(() => {
                      processing.value = false
                      isOpen.value = false
                    })
                  })
              }
            })
          })
        } else {
          axios({
            baseURL: isDevelop.value
              ? 'https://asia-northeast1-pixage-app-development.cloudfunctions.net/commissionEditNotification'
              : 'https://asia-northeast1-pixage-app.cloudfunctions.net/commissionEditNotification',
            method: 'post',
            params: {
              title: commissionTitle.value,
              type: commissionType.value,
            },
          }).then(() => {
            processing.value = false
            isOpen.value = false
          })
        }
      })
    } else {
      processing.value = false
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
    if (files.length > 2 - currentImages.value.length) {
      myVueUploadDropImagesRef.value.reset()
      if (currentImages.value.length === 1) {
        handleImageValidate(app.i18n.t('postCommissionImages.validate4').toString())
      } else {
        handleImageValidate(app.i18n.t('postCommissionImages.validate1').toString())
      }
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
    isOpen,
    processing,
    commissionTitle,
    commissionType,
    commissionPrice,
    commissionDescription,
    workPeriod,
    acceptDetail,
    imageFiles,
    imageFilesErrorMessage,
    currentImages,
    myVueUploadDropImagesRef,
    isDirty,
    params,
    initEditCommission,
    addFile,
    handleImageValidate,
    handleImageNull,
    deleteImage,
    clickSendEditCommission,
    handleImage,
  }
}

export type EditCommissionStore = ReturnType<typeof useEditCommission>
export { useEditCommission }
