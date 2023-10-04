import firebase from 'firebase/compat'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBcrbe9xV5xYndsI_lBXLVj1fiKXTerAQQ',
  authDomain: 'development.pixage.app',
  projectId: 'pixage-app-development',
  storageBucket: 'pixage-app-development.appspot.com',
  messagingSenderId: '1077569702753',
  appId: '1:1077569702753:web:dcf62102b267f0a6791320',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const auth = firebase.auth()
const firestore = firebase.firestore()
const storage = firebase.storage()
const timestamp = firebase.firestore.FieldValue.serverTimestamp()
const provideTwitter = new firebase.auth.TwitterAuthProvider()

export default firebase
export { auth, firestore, storage, timestamp, provideTwitter }
