import { reactive, ref, useContext } from '@nuxtjs/composition-api'
import { firestore, timestamp } from '@/plugins/firebase'
import { useValidation } from 'vue-composable'
import { useRule } from '@/compositions/rule'
import { getUserFromCookie } from '@/utils/cookieDecode'

const usePr = () => {
  /** composition-api **/
  const { app } = useContext()
  const { prLength } = useRule()
  /** /composition-api **/

  /** Variables **/
  const user = getUserFromCookie(app.$cookie.get('__session'))
  /** /Variables **/

  // 通信中かどうかの判定
  const processing = ref<boolean>(false)

  // PRを入力したかの判定
  const isUpdate = ref<boolean>(false)

  // 口座名義を格納
  const pr = ref<string>('')

  // その項目を入力・変更したかの判定（バリデーションで使用）
  const isDirty = reactive({
    pr: false,
  })

  // PR入力のバリデーション
  const params = useValidation({
    pr: {
      $value: pr,
      format: {
        $validator: prLength,
        $message: app.i18n.t('validate.prFormatIsInValid'),
      },
    },
  })

  // PRを初期化
  const initPr = async () => {
    processing.value = false
    isUpdate.value = false
    pr.value = ''
    const prDoc = await firestore.doc(`usersPublicData/${user?.user_id}/creator/pr`).get()
    if (prDoc.exists) {
      pr.value = prDoc.data()?.pr
    }
  }

  // バリデーションにかからなければ投稿するデータを送信
  const clickSendPr = async () => {
    if (!params.$anyInvalid) {
      processing.value = true
      const batch = firestore.batch()
      const prRef = firestore.doc(`usersPublicData/${user?.user_id}/creator/pr`)
      const prDoc = await prRef.get()
      if (!prDoc.exists) {
        batch.set(prRef, {
          pr: pr.value,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      } else {
        batch.update(prRef, {
          pr: pr.value,
          updatedAt: timestamp,
        })
      }
      batch.commit().then(() => {
        processing.value = false
        isUpdate.value = true
      })
    } else {
      if (params.pr.$anyInvalid) isDirty.pr = true
      return await params.$touch()
    }
  }

  return {
    processing,
    isUpdate,
    pr,
    isDirty,
    params,
    initPr,
    clickSendPr,
  }
}

export type PrStore = ReturnType<typeof usePr>
export { usePr }
