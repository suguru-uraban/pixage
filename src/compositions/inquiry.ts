import { reactive, ref, useContext } from '@nuxtjs/composition-api'
import axios from 'axios'
import { useValidation } from 'vue-composable'
import { useRule } from '@/compositions/rule'

const useInquiry = () => {
  /** composition-api **/
  const { app } = useContext()
  const { inquiryNameLength, inquiryEmailFormat, inquirySubjectLength, inquiryContentLength } =
    useRule()
  /** /composition-api **/

  // 開発環境かどうかの判定
  const isDevelop = ref<boolean>(false)

  // 問い合わせ者の名前を格納
  const inquiryName = ref<string>('')

  // 問い合わせ者のメールアドレスを格納
  const inquiryMail = ref<string>('')

  // 問い合わせ者のメールアドレス（確認）を格納
  const inquiryMailConfirm = ref<string>('')

  // 問い合わせの件名を格納
  const inquirySubject = ref<string>('')

  // 問い合わせの件名を格納
  const inquiryContent = ref<string>('')

  // プライバシーポリシーに同意したかの判定
  const isAgree = ref<boolean>(false)

  // 送信したかの判定
  const isSended = ref<boolean>(false)

  // その項目を入力・変更したかの判定（バリデーションで使用）
  const isDirty = reactive({
    inquiryName: false,
    inquiryMail: false,
    inquiryMailConfirm: false,
    inquirySubject: false,
    inquiryContent: false,
  })

  // お問い合わせのバリデーション
  const params = useValidation({
    inquiryName: {
      $value: inquiryName,
      format: {
        $validator: inquiryNameLength,
        $message: app.i18n.t('validate.inquiryNameFormatIsInValid'),
      },
    },
    inquiryMail: {
      $value: inquiryMail,
      format: {
        $validator: inquiryEmailFormat,
        $message: app.i18n.t('validate.inquiryMailFormatIsInValid'),
      },
    },
    inquiryMailConfirm: {
      $value: inquiryMailConfirm,
      match: {
        $validator(x: string) {
          return x === inquiryMail.value
        },
        $message: app.i18n.t('validate.inquiryMailDoNotMatch'),
      },
    },
    inquirySubject: {
      $value: inquirySubject,
      format: {
        $validator: inquirySubjectLength,
        $message: app.i18n.t('validate.inquirySubjectFormatIsInValid'),
      },
    },
    inquiryContent: {
      $value: inquiryContent,
      format: {
        $validator: inquiryContentLength,
        $message: app.i18n.t('validate.inquiryContentFormatIsInValid'),
      },
    },
  })

  // 問い合わせを送信する
  const sendInquiry = async () => {
    if (!params.$anyInvalid) {
      axios({
        baseURL: isDevelop.value
          ? 'https://asia-northeast1-pixage-app-development.cloudfunctions.net/inquiryReceive'
          : 'https://asia-northeast1-pixage-app.cloudfunctions.net/inquiryReceive',
        method: 'post',
        params: {
          name: inquiryName.value,
          mail: inquiryMail.value,
          subject: inquirySubject.value,
          content: inquiryContent.value,
        },
      }).then(() => {
        inquiryName.value = ''
        inquiryMail.value = ''
        inquiryMailConfirm.value = ''
        inquirySubject.value = ''
        inquiryContent.value = ''
        isAgree.value = false
        isSended.value = true
      })
    } else {
      if (params.inquiryName.$anyInvalid) isDirty.inquiryName = true
      if (params.inquiryMail.$anyInvalid) isDirty.inquiryMail = true
      if (params.inquiryMailConfirm.$anyInvalid) isDirty.inquiryMailConfirm = true
      if (params.inquirySubject.$anyInvalid) isDirty.inquirySubject = true
      if (params.inquiryContent.$anyInvalid) isDirty.inquiryContent = true
      return await params.$touch()
    }
  }

  return {
    isDevelop,
    inquiryName,
    inquiryMail,
    inquiryMailConfirm,
    inquirySubject,
    inquiryContent,
    isAgree,
    isSended,
    isDirty,
    params,
    sendInquiry,
  }
}

export type InquiryStore = ReturnType<typeof useInquiry>
export { useInquiry }
