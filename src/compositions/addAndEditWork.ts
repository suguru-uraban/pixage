import { reactive, ref, SetupContext, useRouter } from '@nuxtjs/composition-api'
import { useValidation } from 'vue-composable'
import firebase, { firestore, storage, timestamp } from '@/plugins/firebase'
import { useRule } from '@/compositions/rule'
import { CreatorType } from '@/types/creatorType'
import { ModalType } from '@/types/modalType'

const useAddAndEditWork = () => {
  /** composition-api **/
  const router = useRouter()
  const { required, workTitleLength, workDescriptionLength } = useRule()
  /** /composition-api **/

  // 作品追加時の通信中か否かの判定
  const processing = ref<boolean>(false)

  // サムネイルファイル一枚の格納先
  const thumbnailFile = ref<File | null>(null)

  // 作品名の格納先
  const workTitle = ref<string>('')

  // 概要の格納先
  const workDescription = ref<string>('')

  // 全作業対応化のクリエイターのID
  const creatorAllId = ref<number>(0)

  // 原作のみのクリエイターのID
  const creatorStoryId = ref<number>(0)

  // 作画のみのクリエイターのID
  const creatorDrawingId = ref<number>(0)

  // クリエイターバリデーションのエラーメッセージを格納
  const creatorError = ref<string>('')

  // クリエイターが一人か二人かの判定
  const radioCreator = ref<string>('single')

  // 選択したジャンルの格納先
  const genre = ref<string>('')

  // 公式か否かの判定
  const official = ref<boolean>(false)

  // その項目を入力・変更したかの判定（バリデーションで使用）
  const isDirty = reactive({
    workTitle: false,
    workDescription: false,
    creator: false,
    genre: false,
  })

  // すでに作品が存在する場合は作品のUIDを格納
  const workUid = ref<string>('')

  // 作品追加・編集のバリデーション
  const params = useValidation({
    workTitle: {
      $value: workTitle,
      required: {
        $validator: required,
        $message: 'タイトルは必須項目です。',
      },
      format: {
        $validator: workTitleLength,
        $message: 'タイトルは50文字以内で入力してください。',
      },
    },
    workDescription: {
      $value: workDescription,
      required: {
        $validator: required,
        $message: '作品概要は必須項目です。',
      },
      format: {
        $validator: workDescriptionLength,
        $message: '作品概要は250文字以内で入力してください。',
      },
    },
    genre: {
      $value: genre,
      required: {
        $validator: required,
        $message: 'ジャンルは必須項目です。',
      },
    },
  })

  // クリエイターの区分ごとの表示名格納先（Creator）
  const creatorName = reactive({
    all: '',
    story: '',
    drawing: '',
  })

  // クリエイターのfirestoreデータの格納先（Creator）
  const getCreators = ref<firebase.firestore.DocumentData>([])

  // 選択したクリエイターのfirestoreデータの格納先（Creator）
  const selectCreators = ref<firebase.firestore.DocumentData>([])

  // クリエイターの区分ごとのID格納先（Creator）
  const creatorIds = reactive({
    all: 0,
    story: 0,
    drawing: 0,
  })

  // すでにサムネイルがある場合の、サムネイル画像の格納先（Thumbnail）
  const prevThumbnail = ref<string>('')

  // サムネイル追加の際のエラーメッセージの格納先（Thumbnail）
  const errorMessageAddThumbnail = ref<string>('')

  // アップロードされたサムネイルの参照元（Thumbnail）
  const myVueUploadDropImagesRef = ref<any>()

  // 追加・編集後は値を初期化する
  const initVariables = () => {
    thumbnailFile.value = null
    workTitle.value = ''
    workDescription.value = ''
    creatorAllId.value = 0
    creatorStoryId.value = 0
    creatorDrawingId.value = 0
    creatorError.value = ''
    radioCreator.value = 'single'
    genre.value = ''
    official.value = false
    isDirty.workTitle = false
    isDirty.workDescription = false
    isDirty.creator = false
    isDirty.genre = false
    creatorName.all = ''
    creatorName.story = ''
    creatorName.drawing = ''
    getCreators.value = []
    selectCreators.value = []
    creatorIds.all = 0
    creatorIds.story = 0
    creatorIds.drawing = 0
    prevThumbnail.value = ''
    errorMessageAddThumbnail.value = ''
    myVueUploadDropImagesRef.value = undefined
  }

  // クリエイターのみ別でバリデーションの関数を追加
  const creatorValidation = () => {
    if (radioCreator.value === 'single' && creatorAllId.value === 0) {
      creatorError.value = '作家名は必須項目です。'
    } else if (
      radioCreator.value === 'multi' &&
      (creatorStoryId.value === 0 || creatorDrawingId.value === 0)
    ) {
      creatorError.value = '原作担当と作画担当は両方入力してください。'
    } else {
      creatorError.value = ''
    }
  }

  // 選択されたサムネイルファイルを格納
  const addFile = (files: File[]) => {
    thumbnailFile.value = files[0]
  }

  // 選択されたクリエイターを取得（使わないクリエイター区分は0が入る）
  const getCreator = (selectCreatorId: { all: number; story: number; drawing: number }) => {
    creatorAllId.value = selectCreatorId.all
    creatorStoryId.value = selectCreatorId.story
    creatorDrawingId.value = selectCreatorId.drawing
  }

  // ボタンをクリックしてバリデーションのチェック後に作品を追加
  const clickAddWork = async () => {
    creatorValidation()
    try {
      if (!params.$anyInvalid && creatorError.value === '') {
        let prevSerialNumber = 0
        processing.value = true
        const batch = firestore.batch()
        const worksCount = firestore.doc(`worksCount/global`)
        const worksRef = firestore.collection('works').doc()
        const workSubRef = worksRef.collection('ja').doc('data')
        const newWorkId = worksRef.id
        const storageWorksRef = storage.ref('thumbnail')
        await worksCount.get().then((doc) => {
          prevSerialNumber = doc.data()?.serialNumber
        })
        batch.update(worksCount, {
          serialNumber: firebase.firestore.FieldValue.increment(1),
          count: firebase.firestore.FieldValue.increment(1),
          updatedAt: timestamp,
        })
        batch.set(worksRef, {
          workId: prevSerialNumber + 1,
          totalLike: 0,
          favorite: 0,
          popular: 0,
          official: official.value,
          creatorAllId: creatorAllId.value,
          creatorStoryId: creatorStoryId.value,
          creatorDrawingId: creatorDrawingId.value,
          searchCreatorId: [creatorAllId.value, creatorStoryId.value, creatorDrawingId.value],
          release: false,
          language: ['ja'],
          episodeCount: 0,
          episodeSerialNumber: 0,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        batch.set(workSubRef, {
          workTitle: workTitle.value,
          workDescription: workDescription.value,
          thumbnail: '',
          genre: genre.value,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        batch.commit().then(async () => {
          const path = `${newWorkId}/thumbnail.jpg`
          const thumbnailRef = storageWorksRef.child(path)
          if (thumbnailFile.value !== null) {
            await thumbnailRef.put(thumbnailFile.value)
            thumbnailRef.getDownloadURL().then((url: string) => {
              firestore
                .doc(`works/${newWorkId}/ja/data`)
                .update({
                  thumbnail: url,
                  updatedAt: timestamp,
                })
                .then(() => {
                  processing.value = false
                  initVariables()
                  router.push('/admin/list-works')
                })
            })
          } else {
            processing.value = false
            initVariables()
            router.push('/admin/list-works')
          }
        })
      } else {
        if (params.workTitle.$anyInvalid) isDirty.workTitle = true
        if (params.workDescription.$anyInvalid) isDirty.workDescription = true
        if (creatorError.value !== '') isDirty.creator = true
        if (params.genre.$anyInvalid) isDirty.genre = true
        return params.$touch()
      }
    } catch (err) {
      // TODO: エラーが発見され次第対応を考える
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  // 編集する場合は初期値を各フォームに挿入する
  const initEditWork = (id: string) => {
    if (id !== undefined) {
      processing.value = true
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
            workTitle.value = tmp.ja.workTitle
            workDescription.value = tmp.ja.workDescription
            creatorAllId.value = tmp.creatorAllId
            creatorStoryId.value = tmp.creatorStoryId
            creatorDrawingId.value = tmp.creatorDrawingId
            radioCreator.value = tmp.creatorAllId ? 'single' : 'multi'
            genre.value = tmp.ja.genre
            official.value = tmp.official
          })
        })
        .then(() => {
          processing.value = false
        })
    }
  }

  // ボタンをクリックしてバリデーションのチェック後に作品を編集
  const clickEditWork = async () => {
    creatorValidation()
    try {
      if (!params.$anyInvalid && creatorError.value === '') {
        processing.value = true
        const batch = firestore.batch()
        const worksRef = firestore.collection('works').doc(workUid.value)
        const workSubRef = await worksRef.collection('ja').doc('data')
        const newWorkId = worksRef.id
        const storageWorksRef = storage.ref('thumbnail')
        batch.update(worksRef, {
          creatorAllId: creatorAllId.value,
          creatorStoryId: creatorStoryId.value,
          creatorDrawingId: creatorDrawingId.value,
          searchCreatorId: [creatorAllId.value, creatorStoryId.value, creatorDrawingId.value],
          official: official.value,
          updatedAt: timestamp,
        })
        batch.update(workSubRef, {
          workTitle: workTitle.value,
          workDescription: workDescription.value,
          genre: genre.value,
          updatedAt: timestamp,
        })
        batch.commit().then(async () => {
          const path = `${workUid.value}/thumbnail.jpg`
          const thumbnailRef = storageWorksRef.child(path)
          if (thumbnailFile.value !== null) {
            await thumbnailRef.put(thumbnailFile.value)
            thumbnailRef.getDownloadURL().then((url: string) => {
              firestore
                .doc(`works/${newWorkId}/ja/data`)
                .update({
                  thumbnail: url,
                  updatedAt: timestamp,
                })
                .then(() => {
                  processing.value = false
                  initVariables()
                  router.push('/admin/list-works')
                })
            })
          } else {
            processing.value = false
            initVariables()
            router.push('/admin/list-works')
          }
        })
      } else {
        if (params.workTitle.$anyInvalid) isDirty.workTitle = true
        if (params.workDescription.$anyInvalid) isDirty.workDescription = true
        if (creatorError.value !== '') isDirty.creator = true
        if (params.genre.$anyInvalid) isDirty.genre = true
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
      case 'workTitle':
        params.workTitle.$reset()
        isDirty.workTitle = false
        break
      case 'workDescription':
        params.workDescription.$reset()
        isDirty.workDescription = false
        break
      case 'genre':
        params.genre.$reset()
        isDirty.genre = false
        break
    }
  }

  /** Inner Component **/
  // 入力または選択した項目を取得する
  const handleInput = (event: Event, ctx: SetupContext) => {
    const target = event.target as HTMLInputElement
    ctx.emit('input', target.value)
  }

  // 項目を初期化する
  const resetInput = (ctx: SetupContext) => {
    ctx.emit('is-clean')
  }
  /** /Inner Component **/

  /** Inner Component(Creator) **/
  // クリエイターが一人の場合と二人の場合を切り替える
  const changeCreatorNum = (event: Event, ctx: SetupContext) => {
    ctx.emit('delete-error')
    ctx.emit('is-clean')
    if (event.target instanceof HTMLInputElement) {
      ctx.emit('change-radio', event.target.value)
    }
    creatorName.all = ''
    creatorName.story = ''
    creatorName.drawing = ''
    creatorIds.all = 0
    creatorIds.story = 0
    creatorIds.drawing = 0
  }

  // クリエイターのデータを取得する
  const fetchCreator = (
    radio: string,
    operator: firebase.firestore.WhereFilterOp,
    isCreator: CreatorType
  ) => {
    processing.value = true
    firestore
      .collection('usersPublicData')
      .where('isCreator', operator, isCreator)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (
            radio === 'single' ||
            (radio === 'multi' && !Object.values(creatorIds).includes(doc.data().creatorId))
          ) {
            getCreators.value.push(...[doc.data()])
          }
        })
      })
      .then(() => {
        processing.value = false
      })
  }

  // クリエイターのデータを取得する前に、使っていないクリエイターの区分に関する変数をクリアーする
  // allを選択し場合、storyとdrawingは使わないので一回初期化してallのデータを取得、という感じ
  const handleOpenModalWithFetchCreator = (
    ctx: SetupContext,
    radio: string,
    modalType: ModalType
  ) => {
    ctx.emit('delete-error')
    ctx.emit('is-clean')
    if (getCreators.value.length) {
      getCreators.value.length = 0
    }
    if (modalType === 'selectStory') {
      fetchCreator(radio, '!=', 'drawingOnly')
    } else if (modalType === 'selectDrawing') {
      fetchCreator(radio, '!=', 'storyOnly')
    } else {
      fetchCreator(radio, '==', 'all')
    }
  }

  // 選択したクリエイターのdisplayNameとcreatorIdを取得し、使っていないクリエイター区分のデータは初期化する
  const setCreator = async (ctx: SetupContext, creatorId: number, modalType: ModalType) => {
    if (selectCreators.value.length) {
      selectCreators.value.length = 0
    }
    processing.value = true
    await firestore
      .collection('usersPublicData')
      .where('creatorId', '==', creatorId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          selectCreators.value.push(...[doc.data()])
        })
      })
    if (modalType === 'selectStory') {
      creatorName.all = ''
      creatorName.story = selectCreators.value[0].displayName
      creatorIds.all = 0
      creatorIds.story = selectCreators.value[0].creatorId
    } else if (modalType === 'selectDrawing') {
      creatorName.all = ''
      creatorName.drawing = selectCreators.value[0].displayName
      creatorIds.all = 0
      creatorIds.drawing = selectCreators.value[0].creatorId
    } else {
      creatorName.all = selectCreators.value[0].displayName
      creatorName.story = ''
      creatorName.drawing = ''
      creatorIds.all = selectCreators.value[0].creatorId
      creatorIds.story = 0
      creatorIds.drawing = 0
    }
    ctx.emit('send-creator-id', creatorIds)
    processing.value = false
  }
  /** /Inner Component(Creator) **/

  /** Inner Component(Official) **/
  // 公式作品のチェックボックスの値を取得する
  const handleCheck = (event: Event, ctx: SetupContext) => {
    const target = event.target as HTMLInputElement
    ctx.emit('input', target.checked)
  }
  /** /Inner Component(Official) **/

  /** Inner Component(Thumbnail) **/
  // すでにサムネイルがある場合は、そのサムネイル画像を呼び出す
  const initThumbnail = (pageType: string, id: string) => {
    if (pageType === 'edit' && id !== undefined) {
      firestore
        .collection('works')
        .where('workId', '==', Number(id))
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            const tmp = doc.data()
            const subDoc = await doc.ref.collection('ja').doc('data').get()
            tmp.ja = subDoc.data()
            prevThumbnail.value = tmp.ja.thumbnail
          })
        })
    }
  }

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
    errorMessageAddThumbnail.value = ''
    if (files.length > 1) {
      myVueUploadDropImagesRef.value.reset()
      errorMessageAddThumbnail.value = 'サムネイルは1枚だけ選択してください。'
    } else if (!validateType(files)) {
      myVueUploadDropImagesRef.value.reset()
      errorMessageAddThumbnail.value = 'サムネイルはjpgファイルを使用してください。'
    } else if (!validateSize(files)) {
      myVueUploadDropImagesRef.value.reset()
      errorMessageAddThumbnail.value = 'サムネイルは500KB以下にしてください。'
    } else {
      ctx.emit('add-file', files)
    }
  }
  /** /Inner Component(Thumbnail) **/

  return {
    processing,
    thumbnailFile,
    workTitle,
    workDescription,
    creatorAllId,
    creatorStoryId,
    creatorDrawingId,
    creatorError,
    radioCreator,
    genre,
    official,
    isDirty,
    params,
    creatorName,
    getCreators,
    creatorIds,
    prevThumbnail,
    errorMessageAddThumbnail,
    myVueUploadDropImagesRef,
    initVariables,
    addFile,
    getCreator,
    clickAddWork,
    initEditWork,
    clickEditWork,
    resetValidation,
    handleInput,
    resetInput,
    changeCreatorNum,
    handleOpenModalWithFetchCreator,
    setCreator,
    handleCheck,
    initThumbnail,
    handleImage,
  }
}

export type AddAndEditWorkStore = ReturnType<typeof useAddAndEditWork>
export { useAddAndEditWork }
