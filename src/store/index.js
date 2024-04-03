import { createStore, combineReducers, compose } from 'redux'
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import { fb } from 'utils/Firebase'

// function PlaceholderReducer (state = {}, action) {
//   switch (action.type) {
//     case 'EXAMPLE':
//       return {example: true}
//     default:
//       return state
//   }
// }

const rrfConfig = {
  userProfile: 'Users'
  // attachAuthIsReady: true
}

const createStoreWithFirebase = compose(reactReduxFirebase(fb, rrfConfig))(createStore)

const rootReducer = combineReducers({
  firebase: firebaseReducer
})

const initialState = {}
const store = createStoreWithFirebase(rootReducer, initialState)

export default store
