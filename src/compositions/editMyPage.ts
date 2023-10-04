import { reactive, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { useValidation } from 'vue-composable'
import { auth, firestore, storage, timestamp } from '@/plugins/firebase'
import { $cookiesOptDelete, $cookiesOptSecure } from '@/plugins/cookie'
import { useRule } from '@/compositions/rule'
import { StateType } from '@/utils/states/user'
import { getUserFromCookie } from '@/utils/cookieDecode'
import { AuthError } from '@/types/authType'

const useEditMyPage = () => {
  /** composition-api **/
  const { app } = useContext()
  const router = useRouter()
  const { required, displayNameLength, emailFormat, nameLength } = useRule()
  /** /composition-api **/

  // 編集時に通信中か否かの判定
  const processing = ref<boolean>(false)

  // 新しい表示名の格納先
  const newDisplayName = ref<string>('')

  // 表示名編集の際のエラーメッセージの格納先
  const errorMessageDisplayName = ref<string>('')

  // 新しいメールアドレスの格納先
  const newEmail = ref<string>('')

  // メールアドレス編集の際のエラーメッセージの格納先
  const errorMessageEmail = ref<string>('')

  // 新しい名の格納先
  const newFirstName = ref<string>('')

  // 新しい姓の格納先
  const newLastName = ref<string>('')

  // 氏名編集の際のエラーメッセージの格納先
  const errorMessageName = ref<string>('')

  // 新しいプロフィール画像の格納先
  const hasPicture = ref<any>(null)

  // プロフィール画像編集の際のエラーメッセージの格納先
  const errorMessagePicture = ref<string>('')

  // その項目を入力・変更したかの判定（バリデーションで使用）
  const isDirty = reactive({
    newDisplayName: false,
    newEmail: false,
    newFirstName: false,
    newLastName: false,
  })

  // マイページ編集のバリデーション
  const params = useValidation({
    newDisplayName: {
      $value: newDisplayName,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.displayNameIsRequired'),
      },
      format: {
        $validator: displayNameLength,
        $message: app.i18n.t('validate.displayNameFormatIsInValid'),
      },
    },
    newEmail: {
      $value: newEmail,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.emailIsRequired'),
      },
      format: {
        $validator: emailFormat,
        $message: app.i18n.t('validate.emailFormatIsInValid'),
      },
    },
    newFirstName: {
      $value: newFirstName,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.firstNameIsRequired'),
      },
      format: {
        $validator: nameLength,
        $message: app.i18n.t('validate.firstNameFormatIsInValid'),
      },
    },
    newLastName: {
      $value: newLastName,
      required: {
        $validator: required,
        $message: app.i18n.t('validate.lastNameIsRequired'),
      },
      format: {
        $validator: nameLength,
        $message: app.i18n.t('validate.lastNameFormatIsInValid'),
      },
    },
  })

  // 値を初期化
  const initVariables = () => {
    newDisplayName.value = ''
    errorMessageDisplayName.value = ''
    newEmail.value = ''
    errorMessageEmail.value = ''
    newFirstName.value = ''
    newLastName.value = ''
    errorMessageName.value = ''
    hasPicture.value = null
    errorMessagePicture.value = ''
    isDirty.newDisplayName = false
    isDirty.newEmail = false
    isDirty.newFirstName = false
    isDirty.newLastName = false
  }

  // 氏名を表示
  const viewRealName = (state: StateType) => {
    if (state.firstName.value && state.lastName.value) {
      if (state.language.value === 'ja') {
        return `${state.lastName.value} ${state.firstName.value}`
      }
      return `${state.firstName.value} ${state.lastName.value}`
    }
    return app.i18n.t('myPage.notSet')
  }

  // クリエイターorユーザー、クリエイターの場合は区分も表示
  const viewIsCreator = (state: StateType) => {
    if (state.isCreator.value === 'notCreator') {
      return app.i18n.t('myPage.user')
    } else if (state.isActive.value) {
      if (state.isCreator.value === 'all') {
        return app.i18n.t('myPage.inActivityAll')
      } else if (state.isCreator.value === 'storyOnly') {
        return app.i18n.t('myPage.inActivityStory')
      } else if (state.isCreator.value === 'drawingOnly') {
        return app.i18n.t('myPage.inActivityDrawing')
      } else if (state.isCreator.value === 'commissionOnly') {
        return app.i18n.t('myPage.inActivityCommission')
      }
    } else if (state.isCreator.value === 'all') {
      return app.i18n.t('myPage.inactiveAll')
    } else if (state.isCreator.value === 'storyOnly') {
      return app.i18n.t('myPage.inactiveStory')
    } else if (state.isCreator.value === 'drawingOnly') {
      return app.i18n.t('myPage.inactiveDrawing')
    } else if (state.isCreator.value === 'commissionOnly') {
      return app.i18n.t('myPage.inactiveCommission')
    }
  }

  // 未認証の場合の認証メール送信
  const sendVerifyEmail = async (state: StateType) => {
    await auth.currentUser?.sendEmailVerification()
    await auth.signOut()
    app.$cookie.set('__session', '', $cookiesOptDelete)
    state.cleanUserData()
    router.push('/verify-sendmail')
  }

  /** Inner Component(DisplayNameEditModal) **/
  // 表示名を編集
  const editDisplayName = (state: StateType) => {
    processing.value = true
    try {
      const user = getUserFromCookie(app.$cookie.get('__session'))
      firestore
        .doc(`usersPublicData/${user?.user_id}`)
        .update({
          displayName: newDisplayName.value,
          updatedAt: timestamp,
        })
        .then(() => {
          state.displayName.value = newDisplayName.value
          processing.value = false
        })
    } catch (err) {
      errorMessageDisplayName.value = app.i18n.t('error.otherError').toString()
    }
  }

  // 表示名のバリデーションをリセット
  const resetValidateDisplayName = () => {
    params.newDisplayName.$reset()
    isDirty.newDisplayName = false
    errorMessageDisplayName.value = ''
  }

  // 表示名のフォームをリセット
  const resetInputDisplayName = () => {
    resetValidateDisplayName()
    newDisplayName.value = ''
  }
  /** /Inner Component(DisplayNameEditModal) **/

  /** Inner Component(EmailEditModal) **/
  // メールアドレスを編集
  const editEmail = (state: StateType) => {
    processing.value = true
    try {
      const user = getUserFromCookie(app.$cookie.get('__session'))
      if (state.provider.value === 'password') {
        auth.currentUser
          ?.updateEmail(newEmail.value)
          .then(async () => {
            const token = await auth.currentUser?.getIdToken(true)
            await app.$cookie.set('__session', token, $cookiesOptSecure)
            await auth.currentUser?.sendEmailVerification()
            firestore
              .doc(`usersSecretData/${user?.user_id}`)
              .update({
                email: newEmail.value,
                emailDomain: newEmail.value.split('@')[1],
                updatedAt: timestamp,
              })
              .then(async () => {
                await auth.signOut()
                app.$cookie.set('__session', '', $cookiesOptDelete)
                state.cleanUserData()
                router.push('/verify-sendmail')
              })
          })
          .catch((err) => {
            const error = err as AuthError

            switch (error.code) {
              case 'auth/email-already-in-use':
                errorMessageEmail.value = app.i18n.t('error.emailAlreadyInUse').toString()
                return
              default:
                errorMessageEmail.value = ''
            }
          })
      } else {
        firestore
          .doc(`usersSecretData/${user?.user_id}`)
          .update({
            email: newEmail.value,
            emailDomain: newEmail.value.split('@')[1],
            updatedAt: timestamp,
          })
          .then(() => {
            state.email.value = newEmail.value
            processing.value = false
          })
      }
    } catch (err) {
      errorMessageEmail.value = app.i18n.t('error.otherError').toString()
    }
  }

  // メールアドレスのバリデーションをリセット
  const resetValidateEmail = () => {
    params.newEmail.$reset()
    isDirty.newEmail = false
    errorMessageEmail.value = ''
  }

  // メールアドレスのフォームをリセット
  const resetInputEmail = () => {
    resetValidateEmail()
    newEmail.value = ''
  }
  /** /Inner Component(EmailEditModal) **/

  /** Inner Component(NameEditModal) **/
  // 氏名を編集
  const editName = (state: StateType) => {
    processing.value = true
    const user = getUserFromCookie(app.$cookie.get('__session'))
    firestore
      .doc(`usersSecretData/${user?.user_id}`)
      .update({
        firstName: newFirstName.value,
        lastName: newLastName.value,
        updatedAt: timestamp,
      })
      .then(() => {
        state.firstName.value = newFirstName.value
        state.lastName.value = newLastName.value
        processing.value = false
      })
  }

  // 氏名のバリデーションをリセット
  const resetValidateName = (input: string) => {
    switch (input) {
      case 'firstName':
        params.newFirstName.$reset()
        isDirty.newFirstName = false
        break
      case 'lastName':
        params.newLastName.$reset()
        isDirty.newLastName = false
        break
    }
  }

  // 氏名のフォームをリセット
  const resetInputName = () => {
    params.newFirstName.$reset()
    isDirty.newFirstName = false
    newFirstName.value = ''
    params.newLastName.$reset()
    isDirty.newLastName = false
    newLastName.value = ''
    errorMessageName.value = ''
  }
  /** Inner Component(NameEditModal) **/

  /** Inner Component(PictureEditModal) **/
  // プロフィール画像を編集
  const uploadPicture = (state: StateType) => {
    processing.value = true
    try {
      if (
        hasPicture.value !== null &&
        hasPicture.value.chosenFile !== null &&
        hasPicture.value.chosenFile.type.includes('image/')
      ) {
        errorMessagePicture.value = ''
        const user = getUserFromCookie(app.$cookie.get('__session'))
        const storagePictureRef = storage.ref('picture')
        const path = `${user?.user_id}/image.png`
        const pictureRef = storagePictureRef.child(path)
        hasPicture.value.generateBlob(async (blob: Blob | Uint8Array | ArrayBuffer) => {
          await pictureRef.put(blob)
          pictureRef.getDownloadURL().then((url: string) => {
            firestore
              .doc(`usersPublicData/${user?.user_id}`)
              .update({
                picture: url,
                updatedAt: timestamp,
              })
              .then(() => {
                state.picture.value = url
                processing.value = false
              })
          })
        })
      } else {
        errorMessagePicture.value = app.i18n.t('picture.error1').toString()
      }
    } catch (err) {
      errorMessagePicture.value = app.i18n.t('error.otherError').toString()
    }
  }

  // ファイル形式がjpg、gif、png以外の場合エラーメッセージを表示
  const onFileTypeMismatch = () => {
    errorMessagePicture.value = app.i18n.t('picture.error2').toString()
  }

  // ファイルサイズが200KBより上の場合エラーメッセージを表示
  const onFileSizeExceed = () => {
    errorMessagePicture.value = app.i18n.t('picture.error3').toString()
  }

  // 新しい画像ファイルがドロップされたらエラーメッセージを削除
  const handleNewImage = () => {
    errorMessagePicture.value = ''
  }
  /** /Inner Component(PictureEditModal) **/

  return {
    processing,
    newDisplayName,
    errorMessageDisplayName,
    newEmail,
    errorMessageEmail,
    newFirstName,
    newLastName,
    errorMessageName,
    hasPicture,
    errorMessagePicture,
    isDirty,
    params,
    initVariables,
    viewRealName,
    viewIsCreator,
    sendVerifyEmail,
    editDisplayName,
    resetValidateDisplayName,
    resetInputDisplayName,
    editEmail,
    resetValidateEmail,
    resetInputEmail,
    editName,
    resetValidateName,
    resetInputName,
    uploadPicture,
    onFileTypeMismatch,
    onFileSizeExceed,
    handleNewImage,
  }
}

export type EditMyPageStore = ReturnType<typeof useEditMyPage>
export { useEditMyPage }
