import { ref, SetupContext } from '@nuxtjs/composition-api'
import { firestore, timestamp } from '@/plugins/firebase'

const useRelease = () => {
  // 作品のUIDを格納
  const workUid = ref<string>('')

  // 作品名を格納
  const workTitle = ref<string>('')

  // 話数を格納
  const episodeNum = ref<string>('')

  // 話数名を格納
  const episodeTitle = ref<string>('')

  // 公開されているかどうかの判定
  const release = ref<boolean>(false)

  // propsの変更を検知してworkUid、workTitle、releaseを取得する（watchと併用する）
  const getWorkRelease = (currentWorkId: number, currentWorkTitle: string) => {
    workUid.value = ''
    workTitle.value = ''
    release.value = false
    firestore
      .collection('works')
      .where('workId', '==', currentWorkId)
      .get()
      .then((episodeSnapshot) => {
        episodeSnapshot.forEach((doc) => {
          workUid.value = doc.id
          release.value = doc.data()?.release
        })
      })
    workTitle.value = currentWorkTitle
  }

  // 作品の公開・非公開の切り替え
  const changeWorkRelease = (ctx: SetupContext) => {
    release.value = !release.value
    firestore
      .doc(`works/${workUid.value}`)
      .update({
        release: release.value,
        updatedAt: timestamp,
      })
      .then(() => {
        ctx.emit('switch-release')
      })
  }

  // propsの変更を検知してepisodeNum、episodeTitle、releaseを取得する（watchと併用する）
  const getEpisodeRelease = (workUid: string, currentEpisodeId: number) => {
    episodeNum.value = ''
    episodeTitle.value = ''
    release.value = false
    firestore
      .doc(`works/${workUid}/ja/data`)
      .collection('episode')
      .where('episodeId', '==', currentEpisodeId)
      .get()
      .then((episodeSnapshot) => {
        episodeSnapshot.forEach((doc) => {
          episodeNum.value = doc.data()?.episodeNum
          episodeTitle.value = doc.data()?.episodeTitle
          release.value = doc.data()?.release
        })
      })
  }

  // 話数の公開・非公開の切り替え
  const changeEpisodeRelease = (ctx: SetupContext, workUid: string, currentEpisodeId: number) => {
    release.value = !release.value
    firestore
      .doc(`works/${workUid}/ja/data/episode/${String(currentEpisodeId)}`)
      .update({
        release: release.value,
        updatedAt: timestamp,
      })
      .then(() => {
        ctx.emit('switch-release')
      })
  }

  return {
    workTitle,
    episodeNum,
    episodeTitle,
    release,
    getWorkRelease,
    changeWorkRelease,
    getEpisodeRelease,
    changeEpisodeRelease,
  }
}

export type ReleaseStore = ReturnType<typeof useRelease>
export { useRelease }
