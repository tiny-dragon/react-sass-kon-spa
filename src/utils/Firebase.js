import firebase from 'firebase'
import { FIREBASE_CONFIG } from 'utils/env'
firebase.initializeApp(FIREBASE_CONFIG)

export const fb = firebase
export const fbDbRef = firebase.database()
export const firebaseAuth = firebase.auth
export const storageRef = firebase.storage().ref()
export const provider = new firebaseAuth.GoogleAuthProvider()

firebaseAuth().setPersistence(firebaseAuth.Auth.Persistence.LOCAL)
provider.setCustomParameters({
  prompt: 'select_account'
})

export const formatUser = user => ({
  email: user.email,
  name: user.displayName,
  avatar: user.photoURL
})

export const addUserIfDoesNotExist = (firebase, user) => {
  const userRef = firebase.database().ref(`Users/${user.uid}`)
  userRef.transaction(
    currentData => {
      if (currentData === null) {
        return formatUser(user)
      }
      console.log('User already exists.')
    },
    (err, committed, snapshot) => {
      if (err) {
        console.log('Transaction failed abnormally!', err)
      } else if (!committed) {
        console.log('We aborted the transaction (because user already exists).')
      } else {
        console.log('User added!')
      }
    }
  )
}

export const PopUpAuth = () => {
  (firebaseAuth()).signInWithPopup(provider)
    .then(result => {
      const user = result.user
      addUserIfDoesNotExist(firebase, user)
      console.log(this.state)
      if (user) {
        window.location.href = '/dashboard'
      }
    })
}

export default firebase
