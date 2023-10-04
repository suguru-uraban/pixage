import { ref, SetupContext } from '@nuxtjs/composition-api'
import { firestore, timestamp } from '@/plugins/firebase'

const useCommissionRelease = () => {
  // コミッションのUIDを格納
  const commissionUid = ref<string>('')

  // コミッションのタイトルを格納
  const commissionTitle = ref<string>('')

  // 公開されているかどうかの判定
  const release = ref<boolean>(false)

  // propsの変更を検知してcommissionUid、commissionTitle、approvalを取得する（watchと併用する）
  const getCommissionRelease = (currentCommissionId: number, currentCommissionTitle: string) => {
    commissionUid.value = ''
    commissionTitle.value = ''
    release.value = false
    firestore
      .collection('commissions')
      .where('commissionId', '==', currentCommissionId)
      .get()
      .then((episodeSnapshot) => {
        episodeSnapshot.forEach((doc) => {
          commissionUid.value = doc.id
          release.value = doc.data()?.release
        })
      })
    commissionTitle.value = currentCommissionTitle
  }

  // コミッションの承認・非承認の切り替え
  const changeCommissionRelease = (ctx: SetupContext) => {
    release.value = !release.value
    firestore
      .doc(`commissions/${commissionUid.value}`)
      .update({
        release: release.value,
        updatedAt: timestamp,
      })
      .then(() => {
        ctx.emit('switch-release')
      })
  }

  return {
    commissionTitle,
    release,
    getCommissionRelease,
    changeCommissionRelease,
  }
}

export type CommissionReleaseStore = ReturnType<typeof useCommissionRelease>
export { useCommissionRelease }
