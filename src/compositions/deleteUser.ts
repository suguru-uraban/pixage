import { ref } from '@nuxtjs/composition-api'
import firebase, { firestore, storage, timestamp } from '@/plugins/firebase'

const useDeleteUser = () => {
  // クリエイターIDを格納
  const creatorId = ref<number>(0)

  // ユーザーを削除する
  const deleteUser = async (uid: string) => {
    const usersCountRef = firestore.collection('usersCount').doc('global')
    const creatorsCountRef = firestore.collection('creatorsCount').doc('global')
    const worksCountRef = firestore.collection('worksCount').doc('global')
    const usersPublicDataRef = firestore.collection('usersPublicData').doc(uid)
    const usersSecretDataRef = firestore.collection('usersSecretData').doc(uid)
    const storageThumbnailRef = storage.ref('thumbnail')
    const storageWorksRef = storage.ref('works')
    await usersPublicDataRef.get().then(async (usersPublicDoc) => {
      creatorId.value = usersPublicDoc.data()?.creatorId
      await usersSecretDataRef
        .collection('likes')
        .get()
        .then((likesSnapshot) => {
          if (!likesSnapshot.empty) {
            likesSnapshot.forEach(async (likesDoc) => {
              await firestore
                .collection('works')
                .where('workId', '==', likesDoc.data().workId)
                .get()
                .then((worksLikeSnapshot) => {
                  worksLikeSnapshot.forEach((worksLikeDoc) => {
                    const episodeDocRef = worksLikeDoc.ref
                      .collection('ja')
                      .doc('data')
                      .collection('episode')
                      .doc(String(likesDoc.data().episodeId))
                    worksLikeDoc.ref.update({
                      totalLike: firebase.firestore.FieldValue.increment(-1),
                      popular: firebase.firestore.FieldValue.increment(-1),
                      updatedAt: timestamp,
                    })
                    episodeDocRef.update({
                      like: firebase.firestore.FieldValue.increment(-1),
                      updatedAt: timestamp,
                    })
                  })
                })
              likesDoc.ref.delete()
            })
          }
        })
      await usersSecretDataRef
        .collection('favoriteWorks')
        .get()
        .then((favoriteWorksSnapshot) => {
          if (!favoriteWorksSnapshot.empty) {
            favoriteWorksSnapshot.forEach(async (favoriteWorksDoc) => {
              await firestore
                .collection('works')
                .where('workId', '==', favoriteWorksDoc.data().workId)
                .get()
                .then((worksFavoriteSnapshot) => {
                  worksFavoriteSnapshot.forEach((worksFavoriteDoc) => {
                    worksFavoriteDoc.ref.update({
                      favorite: firebase.firestore.FieldValue.increment(-1),
                      popular: firebase.firestore.FieldValue.increment(-1),
                      updatedAt: timestamp,
                    })
                  })
                })
              favoriteWorksDoc.ref.delete()
            })
          }
        })
      await usersSecretDataRef
        .collection('receivableAccount')
        .get()
        .then((receivableAccountSnapshot) => {
          if (!receivableAccountSnapshot.empty) {
            receivableAccountSnapshot.forEach((receivableAccountDoc) => {
              receivableAccountDoc.ref.delete()
            })
          }
        })
      await usersSecretDataRef
        .collection('monthlySale')
        .get()
        .then((monthlySaleSnapshot) => {
          if (!monthlySaleSnapshot.empty) {
            monthlySaleSnapshot.forEach((monthlySaleDoc) => {
              monthlySaleDoc.ref.delete()
            })
          }
        })
      await usersPublicDataRef
        .collection('creator')
        .get()
        .then((creatorSnapshot) => {
          if (!creatorSnapshot.empty) {
            creatorSnapshot.forEach((creatorDoc) => {
              creatorDoc.ref.delete()
            })
          }
        })
      if (creatorId.value !== 0) {
        await firestore
          .collection('works')
          .where('searchCreatorId', 'array-contains', creatorId.value)
          .get()
          .then((worksSnapshot) => {
            if (!worksSnapshot.empty) {
              worksSnapshot.forEach(async (worksDoc) => {
                const episodeIds: string[] = []
                const deleteWorksId = worksDoc.id
                const deleteWorksLangRef = worksDoc.ref.collection('ja')
                const deleteWorksEpisodeRef = worksDoc.ref
                  .collection('ja')
                  .doc('data')
                  .collection('episode')
                const deleteWorksImageRef = firestore
                  .collection('workImages')
                  .doc(deleteWorksId)
                  .collection('ja')
                await deleteWorksEpisodeRef.get().then((deleteWorksEpisodeSnapshot) => {
                  deleteWorksEpisodeSnapshot.forEach((deleteWorksEpisodeDoc) => {
                    episodeIds.push(deleteWorksEpisodeDoc.id)
                    deleteWorksEpisodeDoc.ref.delete()
                  })
                })
                const worksSalesAllDocRef = worksDoc.ref
                  .collection('ja')
                  .doc('sales')
                  .collection('all')
                await worksSalesAllDocRef.get().then((worksSalesAllSnapshot) => {
                  if (!worksSalesAllSnapshot.empty) {
                    worksSalesAllSnapshot.forEach((worksSalesAllDoc) => {
                      worksSalesAllDoc.ref.delete()
                    })
                  }
                })
                episodeIds.forEach(async (episodeId) => {
                  const worksSalesDocRef = worksDoc.ref
                    .collection('ja')
                    .doc('sales')
                    .collection(episodeId)
                  await worksSalesDocRef.get().then((worksSalesSnapshot) => {
                    if (!worksSalesSnapshot.empty) {
                      worksSalesSnapshot.forEach((worksSalesDoc) => {
                        worksSalesDoc.ref.delete()
                      })
                    }
                  })
                })
                await deleteWorksLangRef.get().then((deleteWorksLangSnapshot) => {
                  deleteWorksLangSnapshot.forEach((deleteWorksLangDoc) => {
                    deleteWorksLangDoc.ref.delete()
                  })
                })
                await worksDoc.ref.delete().then(async () => {
                  const listThumbnailRef = storageThumbnailRef.child(`/${deleteWorksId}`)
                  await listThumbnailRef.listAll().then((thumbnailRes) => {
                    thumbnailRes.items.forEach((thumbnailItemsRef) => {
                      thumbnailItemsRef.delete()
                    })
                  })
                  episodeIds.forEach((episodeId) => {
                    const listWorksRef = storageWorksRef.child(`/${deleteWorksId}/${episodeId}`)
                    listWorksRef.listAll().then((worksRes) => {
                      worksRes.items.forEach((worksItemsRef) => {
                        worksItemsRef.delete()
                      })
                    })
                  })
                })
                await deleteWorksImageRef.get().then((worksImageRef) => {
                  worksImageRef.forEach((worksImageDoc) => {
                    worksImageDoc.ref.delete()
                  })
                })
                worksCountRef.update({
                  count: firebase.firestore.FieldValue.increment(-1),
                  updatedAt: timestamp,
                })
              })
            }
          })
      }
    })
    await usersPublicDataRef.delete()
    await usersSecretDataRef.delete()
    if (creatorId.value !== 0) {
      creatorsCountRef.update({
        count: firebase.firestore.FieldValue.increment(-1),
        updatedAt: timestamp,
      })
    }
    usersCountRef.update({
      count: firebase.firestore.FieldValue.increment(-1),
      updatedAt: timestamp,
    })
    firestore.collection('deletedUsers').add({
      uid,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  return {
    deleteUser,
  }
}

export type DeleteUserStore = ReturnType<typeof useDeleteUser>
export { useDeleteUser }
