import firebase from '@/plugins/firebase'

export default () => {
  if (process.env.NODE_ENV !== 'production') return

  firebase.analytics()
}
