import { reactive, ref, SetupContext, useRouter } from '@nuxtjs/composition-api'
import { useValidation } from 'vue-composable'
import firebase, { firestore, storage, timestamp } from '@/plugins/firebase'
import { useRule } from '@/compositions/rule'

const useAddAndEditEpisode = () => {
  /** composition-api **/
  const router = useRouter()
  const { required, requiredNumber, episodeNumLength, episodeTitleLength, episodePriceMin } =
    useRule()
  /** /composition-api **/

  // 作品追加時の通信中か否かの判定
  const processing = ref<boolean>(false)

  // サムネイルファイルURLの格納先（話数追加時のみ）
  const thumbnail = ref<string>('')

  // 作品名の格納先
  const workTitle = ref<string>('')

  // episodeCountの格納先（話数追加時のみ）
  const episodeCount = ref<string>('0')

  // 原稿ファイルの格納先
  const imageFiles = ref<File[] | null>(null)

  // 原稿アップロード時のエラーメッセージを格納
  const imageFilesErrorMessage = ref<string>('')

  // 話数を格納
  const episodeNum = ref<string>('')

  // サブタイトルを格納
  const episodeTitle = ref<string>('')

  // レンタル価格を格納
  const episodePrice = ref<number>(0)

  // その項目を入力・変更したかの判定（バリデーションで使用）
  const isDirty = reactive({
    episodeNum: false,
    episodeTitle: false,
    episodePrice: false,
  })

  // すでに作品が存在する場合は作品のUIDを格納
  const workUid = ref<string>('')

  // 追加前のシリアルナンバーを取得（追加時のみ）
  const prevEpisodeSerialNumber = ref<number>(0)

  // 更新前のupdatedAtを取得（編集時のみ）
  const prevUpdatedAt = ref<firebase.firestore.FieldValue>(timestamp)

  // 話数追加・編集のバリデーション
  const params = useValidation({
    episodeNum: {
      $value: episodeNum,
      required: {
        $validator: required,
        $message: '話数は必須項目です。',
      },
      format: {
        $validator: episodeNumLength,
        $message: '話数は20文字以内で入力してください。',
      },
    },
    episodeTitle: {
      $value: episodeTitle,
      format: {
        $validator: episodeTitleLength,
        $message: 'サブタイトルは50文字以内で入力してください。',
      },
    },
    episodePrice: {
      $value: episodePrice,
      required: {
        $validator: requiredNumber,
        $message: 'レンタル価格は必須項目です。',
      },
      format: {
        $validator: episodePriceMin,
        $message: 'レンタル価格は0以上を入力してください',
      },
    },
  })

  // 画像追加の際のエラーメッセージを格納（Image）
  const errorMessageAddImages = ref<string>('')

  // 選択された画像ファイルの参照元を格納（Image）
  const myVueUploadDropImagesRef = ref<any>()

  // 追加・編集後は値を初期化する
  const initVariables = () => {
    thumbnail.value = ''
    workTitle.value = ''
    episodeCount.value = '0'
    imageFiles.value = null
    imageFilesErrorMessage.value = ''
    episodeNum.value = ''
    episodeTitle.value = ''
    episodePrice.value = 0
    isDirty.episodeNum = false
    isDirty.episodeTitle = false
    isDirty.episodePrice = false
    workUid.value = ''
    prevUpdatedAt.value = timestamp
    errorMessageAddImages.value = ''
    myVueUploadDropImagesRef.value = undefined
  }

  // 話数を追加する作品を取得（追加時のみ）
  const getWork = (id: string) => {
    if (id !== undefined) {
      firestore
        .collection('works')
        .where('workId', '==', Number(id))
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            workUid.value = doc.id
            const tmp = doc.data()
            const subDoc = await doc.ref.collection('ja').doc('data').get()
            tmp.ja = subDoc.data()
            thumbnail.value = tmp.ja.thumbnail
            workTitle.value = tmp.ja.workTitle
            episodeCount.value = tmp.episodeCount
          })
        })
    }
  }

  // 編集する話数を取得（編集時のみ）
  const getEpisode = (workId: string, episodeId: string) => {
    if (workId !== undefined && episodeId !== undefined) {
      firestore
        .collection('works')
        .where('workId', '==', Number(workId))
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            workUid.value = doc.id
            const tmp = doc.data()
            const langDoc = await doc.ref.collection('ja').doc('data').get()
            const episodeCollection = await doc.ref
              .collection('ja')
              .doc('data')
              .collection('episode')
              .where('episodeId', '==', Number(episodeId))
              .get()
            tmp.lang = langDoc.data()
            workTitle.value = tmp.lang.workTitle
            episodeCollection.forEach((episodeDoc) => {
              tmp.episode = episodeDoc.data()
              episodeNum.value = tmp.episode.episodeNum
              episodeTitle.value = tmp.episode.episodeTitle
              episodePrice.value = tmp.episode.episodePrice
            })
          })
        })
    }
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

  // ボタンをクリックしてエピソードを追加する
  const clickAddEpisode = async (id: string) => {
    try {
      if (!params.$anyInvalid && imageFiles.value !== null) {
        processing.value = true
        const batch = firestore.batch()
        const worksRef = firestore.doc(`works/${workUid.value}`)
        const imagesRef = firestore.doc(`workImages/${workUid.value}`)
        await worksRef.get().then((doc) => {
          prevEpisodeSerialNumber.value = doc.data()?.episodeSerialNumber
        })
        const workEpisodeRef = worksRef
          .collection('ja')
          .doc('data')
          .collection('episode')
          .doc(String(prevEpisodeSerialNumber.value + 1))
        const workImagesRef = imagesRef
          .collection('ja')
          .doc(String(prevEpisodeSerialNumber.value + 1))
        const storageWorksRef = storage.ref('works')
        batch.update(worksRef, {
          episodeSerialNumber: firebase.firestore.FieldValue.increment(1),
          episodeCount: firebase.firestore.FieldValue.increment(1),
          updatedAt: timestamp,
        })
        batch.set(workEpisodeRef, {
          episodeId: prevEpisodeSerialNumber.value + 1,
          episodeNum: episodeNum.value,
          episodeTitle: episodeTitle.value,
          episodePrice: Number(episodePrice.value),
          like: 0,
          release: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        batch.set(workImagesRef, {
          images: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        batch.commit().then(() => {
          const images: string[] = []
          let loopCount = 0
          imageFiles.value?.forEach(async (imageFile, index) => {
            const path = `${workUid.value}/${prevEpisodeSerialNumber.value + 1}/${index + 1}.png`
            const imageRef = storageWorksRef.child(path)
            await imageRef.put(imageFile)
            imageRef.getDownloadURL().then((url: string) => {
              images[index] = url
              loopCount += 1
              if (imageFiles.value && loopCount === imageFiles.value?.length) {
                workImagesRef
                  .update({
                    images,
                    updatedAt: timestamp,
                  })
                  .then(() => {
                    processing.value = false
                    router.push(`/admin/detail-work/${id}`)
                  })
              }
            })
          })
        })
      } else {
        if (imageFiles.value === null) imageFilesErrorMessage.value = '画像は必須です。'
        if (params.episodeNum.$anyInvalid) isDirty.episodeNum = true
        if (params.episodeTitle.$anyInvalid) isDirty.episodeTitle = true
        if (params.episodePrice.$anyInvalid) isDirty.episodePrice = true
        return params.$touch()
      }
    } catch (err) {
      // TODO: エラーが発見され次第対応を考える
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  // ボタンをクリックしてエピソードを更新する
  const clickEditEpisode = async (workId: string, episodeId: string) => {
    try {
      if (!params.$anyInvalid) {
        processing.value = true
        const batch = firestore.batch()
        const worksRef = firestore.doc(`works/${workUid.value}`)
        const imagesRef = firestore.doc(`workImages/${workUid.value}`)
        const workEpisodeRef = worksRef
          .collection('ja')
          .doc('data')
          .collection('episode')
          .doc(String(episodeId))
        const workImagesRef = imagesRef.collection('ja').doc(String(episodeId))
        await workEpisodeRef.get().then((doc) => {
          prevUpdatedAt.value = doc.data()?.updatedAt
        })
        const storageWorksRef = storage.ref('works')
        batch.update(workEpisodeRef, {
          episodeNum: episodeNum.value,
          episodeTitle: episodeTitle.value,
          episodePrice: Number(episodePrice.value),
          updatedAt: timestamp,
        })
        batch.commit().then(async () => {
          if (imageFiles.value !== null) {
            const images: string[] = []
            let loopCount = 0
            const prevImagesRef = storageWorksRef.child(`${workUid.value}/${episodeId}`)
            await prevImagesRef.listAll().then((res) => {
              res.items.forEach((itemRef) => {
                itemRef.delete()
              })
            })
            imageFiles.value?.forEach(async (imageFile, index) => {
              const path = `${workUid.value}/${episodeId}/${index + 1}.png`
              const imageRef = storageWorksRef.child(path)
              await imageRef.put(imageFile)
              imageRef.getDownloadURL().then((url: string) => {
                images[index] = url
                loopCount += 1
                if (imageFiles.value && loopCount === imageFiles.value?.length) {
                  workImagesRef
                    .update({
                      images,
                      updatedAt: timestamp,
                    })
                    .then(() => {
                      processing.value = false
                      router.push(`/admin/detail-work/${workId}`)
                    })
                }
              })
            })
          } else {
            processing.value = false
            router.push(`/admin/detail-work/${workId}`)
          }
        })
      } else {
        if (params.episodeNum.$anyInvalid) isDirty.episodeNum = true
        if (params.episodeTitle.$anyInvalid) isDirty.episodeTitle = true
        if (params.episodePrice.$anyInvalid) isDirty.episodePrice = true
        return params.$touch()
      }
    } catch (err) {
      // TODO: エラーが発見され次第対応を考える
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  // バリデーションのリセット
  const resetValidation = (input: string) => {
    switch (input) {
      case 'episodeNum':
        params.episodeNum.$reset()
        isDirty.episodeNum = false
        break
      case 'episodeTitle':
        params.episodeTitle.$reset()
        isDirty.episodeTitle = false
        break
      case 'episodePrice':
        params.episodePrice.$reset()
        isDirty.episodePrice = false
        break
    }
  }

  /** Inner Component **/
  // 入力した項目を取得する
  const handleInput = (event: Event, ctx: SetupContext) => {
    const target = event.target as HTMLInputElement
    ctx.emit('input', target.value)
  }

  // 項目を初期化する
  const resetInput = (ctx: SetupContext) => {
    ctx.emit('is-clean')
  }
  /** /Inner Component **/

  /** Inner Component(Image) **/
  // image/jpeg以外は弾くバリデーション
  const validateType = (files: File[]) => {
    return files.every((file) => file.type === 'image/jpeg')
  }

  // 500KBより大きい画像は弾くバリデーション
  const validateSize = (files: File[]) => {
    return files.every((file) => file.size <= 512000)
  }

  // バリデーションが全て通ったら画像を格納
  const handleImage = (files: File[], ctx: SetupContext) => {
    errorMessageAddImages.value = ''
    if (files.length > 50) {
      myVueUploadDropImagesRef.value.reset()
      ctx.emit('validate', '画像ファイルは50枚まで選択してください。')
      ctx.emit('handle-image-null')
    } else if (!validateType(files)) {
      myVueUploadDropImagesRef.value.reset()
      ctx.emit('validate', '画像はjpgファイルを使用してください。')
      ctx.emit('handle-image-null')
    } else if (!validateSize(files)) {
      myVueUploadDropImagesRef.value.reset()
      ctx.emit('validate', '画像は500KB以下にしてください。')
      ctx.emit('handle-image-null')
    } else {
      ctx.emit('add-file', files)
    }
  }
  /** /Inner Component(Image) **/

  return {
    thumbnail,
    workTitle,
    episodeCount,
    imageFilesErrorMessage,
    episodeNum,
    episodeTitle,
    episodePrice,
    isDirty,
    params,
    errorMessageAddImages,
    myVueUploadDropImagesRef,
    initVariables,
    getWork,
    getEpisode,
    addFile,
    handleImageValidate,
    handleImageNull,
    clickAddEpisode,
    clickEditEpisode,
    resetValidation,
    handleInput,
    resetInput,
    handleImage,
  }
}

export type AddAndEditEpisodeStore = ReturnType<typeof useAddAndEditEpisode>
export { useAddAndEditEpisode }
