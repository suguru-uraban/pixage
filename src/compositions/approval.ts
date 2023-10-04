import { ref, SetupContext } from '@nuxtjs/composition-api'
import { firestore, timestamp } from '@/plugins/firebase'

const useApproval = () => {
  // コミッションのUIDを格納
  const commissionUid = ref<string>('')

  // コミッションのタイトルを格納
  const commissionTitle = ref<string>('')

  // 承認されているかどうかの判定
  const approval = ref<boolean>(false)

  // 公開されているかどうかの判定
  const release = ref<boolean>(false)

  // propsの変更を検知してcommissionUid、commissionTitle、approvalを取得する（watchと併用する）
  const getCommissionApproval = (currentCommissionId: number, currentCommissionTitle: string) => {
    commissionUid.value = ''
    commissionTitle.value = ''
    approval.value = false
    release.value = false
    firestore
      .collection('commissions')
      .where('commissionId', '==', currentCommissionId)
      .get()
      .then((episodeSnapshot) => {
        episodeSnapshot.forEach((doc) => {
          commissionUid.value = doc.id
          approval.value = doc.data()?.approval
          release.value = doc.data()?.release
        })
      })
    commissionTitle.value = currentCommissionTitle
  }

  // コミッションの承認・非承認の切り替え
  const changeCommissionApproval = (ctx: SetupContext) => {
    approval.value = !approval.value
    release.value = !!approval.value
    firestore
      .doc(`commissions/${commissionUid.value}`)
      .update({
        approval: approval.value,
        release: release.value,
        updatedAt: timestamp,
      })
      .then(() => {
        ctx.emit('switch-approval')
      })
  }

  return {
    commissionTitle,
    approval,
    getCommissionApproval,
    changeCommissionApproval,
  }
}

export type ApprovalStore = ReturnType<typeof useApproval>
export { useApproval }
