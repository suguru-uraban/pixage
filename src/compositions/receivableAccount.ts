import { reactive, ref, useContext } from '@nuxtjs/composition-api'
import { firestore, timestamp } from '@/plugins/firebase'
import { useValidation } from 'vue-composable'
import { useRule } from '@/compositions/rule'
import { getUserFromCookie } from '@/utils/cookieDecode'

const useReceivableAccount = () => {
  /** composition-api **/
  const { app } = useContext()
  const {
    required,
    accountNameFormat,
    financialInstitutionNameLength,
    branchNameLength,
    accountNumberFormat,
    phoneNumberFormat,
  } = useRule()
  /** /composition-api **/

  /** Variables **/
  const user = getUserFromCookie(app.$cookie.get('__session'))
  /** /Variables **/

  // 通信中かどうかの判定
  const processing = ref<boolean>(false)

  // 口座情報を設定したかの判定
  const isUpdate = ref<boolean>(false)

  // 口座名義を格納
  const accountName = ref<string>('')

  // 金融機関名を格納
  const financialInstitutionName = ref<string>('')

  // 支店名を格納
  const branchName = ref<string>('')

  // 口座番号を格納
  const accountNumber = ref<string>('')

  // 電話番号を格納
  const phoneNumber = ref<string>('')

  // その項目を入力・変更したかの判定（バリデーションで使用）
  const isDirty = reactive({
    accountName: false,
    financialInstitutionName: false,
    branchName: false,
    accountNumber: false,
    phoneNumber: false,
  })

  // 受取り口座登録のバリデーション
  const params = useValidation({
    accountName: {
      $value: accountName,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.accountNameIsRequired'),
      },
      format: {
        $validator: accountNameFormat,
        $message: app.i18n.t('validate.accountNameFormatIsInValid'),
      },
    },
    financialInstitutionName: {
      $value: financialInstitutionName,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.financialInstitutionNameIsRequired'),
      },
      format: {
        $validator: financialInstitutionNameLength,
        $message: app.i18n.t('validate.financialInstitutionNameFormatIsInValid'),
      },
    },
    branchName: {
      $value: branchName,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.branchNameIsRequired'),
      },
      format: {
        $validator: branchNameLength,
        $message: app.i18n.t('validate.branchNameFormatIsInValid'),
      },
    },
    accountNumber: {
      $value: accountNumber,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.accountNumberIsRequired'),
      },
      format: {
        $validator: accountNumberFormat,
        $message: app.i18n.t('validate.accountNumberFormatIsInValid'),
      },
    },
    phoneNumber: {
      $value: phoneNumber,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.phoneNumberIsRequired'),
      },
      format: {
        $validator: phoneNumberFormat,
        $message: app.i18n.t('validate.phoneNumberFormatIsInValid'),
      },
    },
  })

  // 受取り口座登録を初期化
  const initReceivableAccounts = async () => {
    processing.value = false
    isUpdate.value = false
    accountName.value = ''
    financialInstitutionName.value = ''
    branchName.value = ''
    accountNumber.value = ''
    phoneNumber.value = ''
    const receivableAccountDoc = await firestore
      .doc(`usersSecretData/${user?.user_id}/receivableAccount/data`)
      .get()
    if (receivableAccountDoc.exists) {
      accountName.value = receivableAccountDoc.data()?.accountName
      financialInstitutionName.value = receivableAccountDoc.data()?.financialInstitutionName
      branchName.value = receivableAccountDoc.data()?.branchName
      accountNumber.value = receivableAccountDoc.data()?.accountNumber
      phoneNumber.value = receivableAccountDoc.data()?.phoneNumber
    }
  }

  // バリデーションにかからなければ投稿するデータを送信
  const clickSendReceivableAccount = async () => {
    if (!params.$anyInvalid) {
      processing.value = true
      const batch = firestore.batch()
      const receivableAccountRef = firestore.doc(
        `usersSecretData/${user?.user_id}/receivableAccount/data`
      )
      const receivableAccountDoc = await receivableAccountRef.get()
      if (!receivableAccountDoc.exists) {
        batch.set(receivableAccountRef, {
          accountName: accountName.value,
          financialInstitutionName: financialInstitutionName.value,
          branchName: branchName.value,
          accountNumber: accountNumber.value,
          phoneNumber: phoneNumber.value,
          createdAt: timestamp,
          updatedAt: timestamp,
        })
      } else {
        batch.update(receivableAccountRef, {
          accountName: accountName.value,
          financialInstitutionName: financialInstitutionName.value,
          branchName: branchName.value,
          accountNumber: accountNumber.value,
          phoneNumber: phoneNumber.value,
          updatedAt: timestamp,
        })
      }
      batch.commit().then(() => {
        processing.value = false
        isUpdate.value = true
      })
    } else {
      if (params.accountName.$anyInvalid) isDirty.accountName = true
      if (params.financialInstitutionName.$anyInvalid) isDirty.financialInstitutionName = true
      if (params.branchName.$anyInvalid) isDirty.branchName = true
      if (params.accountNumber.$anyInvalid) isDirty.accountNumber = true
      if (params.phoneNumber.$anyInvalid) isDirty.phoneNumber = true
      return await params.$touch()
    }
  }

  return {
    processing,
    isUpdate,
    accountName,
    financialInstitutionName,
    branchName,
    accountNumber,
    phoneNumber,
    isDirty,
    params,
    initReceivableAccounts,
    clickSendReceivableAccount,
  }
}

export type ReceivableAccountStore = ReturnType<typeof useReceivableAccount>
export { useReceivableAccount }
