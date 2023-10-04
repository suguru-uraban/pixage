import { ref, useRouter } from '@nuxtjs/composition-api'
import { auth } from '@/plugins/firebase'

const useForgotPassword = () => {
  const router = useRouter()

  const errorMessage = ref<String>('')

  const sendMail = (email: string) => {
    auth.sendPasswordResetEmail(email).then(() => {
      router.push('forgot-password-sendmail')
    })
  }

  return {
    errorMessage,
    sendMail,
  }
}

export type ForgotPasswordStore = ReturnType<typeof useForgotPassword>
export { useForgotPassword }
