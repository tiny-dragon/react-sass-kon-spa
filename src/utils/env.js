const LOCAL = 'local'
const DEV = 'dev'
const PROD = 'prod'

const FB_PROD = 'konch-d78ab'
const FB_DEV = 'konch-dev-90dd4'

const getFirebaseInstance = () => {
  if (process.env.NODE_ENV === 'development') {
    return FB_DEV
  }
  return FB_PROD
}

const getCurrentEnv = () => {
  if (process.env.NODE_ENV === 'development' && process.env.API !== 'local') {
    return DEV
  } else if (process.env.NODE_ENV === 'production') {
    return PROD
  }
  return LOCAL
}

const FIREBASE_KEY_OPTIONS = {
  [FB_PROD]: 'AIzaSyAIMScO5HDSfkEltafsrYJeHAflkbxVX5E',
  [FB_DEV]: 'AIzaSyAg7Z4R58XzvKCFxzR86oROFKa_mH5OIaY'
}
const FIREBASE_KEY = FIREBASE_KEY_OPTIONS[getFirebaseInstance()]

const FIREBASE_CONFIG = {
  apiKey: FIREBASE_KEY,
  authDomain: `${getFirebaseInstance()}.firebaseapp.com`,
  databaseURL: `https://${getFirebaseInstance()}.firebaseio.com`,
  storageBucket: `${getFirebaseInstance()}.appspot.com`
}

const WEB_URL_OPTIONS = {
  [PROD]: 'https://app.konch.ai',
  [DEV]: 'https://dev.app.konch.ai',
  [LOCAL]: 'http://localhost:3001'
}
const WEB_URL = WEB_URL_OPTIONS[getCurrentEnv()]

const FUNCTIONS_URL_OPTIONS = {
  [PROD]: 'https://us-central1-konch-d78ab.cloudfunctions.net',
  [DEV]: 'https://us-central1-konch-dev-90dd4.cloudfunctions.net',
  [LOCAL]: 'http://localhost:5000/konch-dev-90dd4/us-central1'
}
const FUNCTIONS_URL = FUNCTIONS_URL_OPTIONS[getCurrentEnv()]
const WEBHOOK_HANDLER_URL = FUNCTIONS_URL + '/processWebook'

const API_URL_OPTIONS = {
  [PROD]: 'https://knch.io/v1',
  [DEV]: 'https://dev.knch.io/v1',
  [LOCAL]: 'http://localhost:3000'
}
const API_URL = API_URL_OPTIONS[getCurrentEnv()]

const COLLECTION_ASSETS_URL_OPTIONS = {
  [PROD]: 'http://assets.knch.io',
  [DEV]: 'http://dev.assets.knch.io',
  [LOCAL]: 'http://dev.assets.knch.io'
}
const ASSETS_URL = COLLECTION_ASSETS_URL_OPTIONS[getCurrentEnv()]

const API_KEY_OPTIONS = {
  [PROD]: 'HmWtFH1q213fYRk2HntfW4aPrFSTnCXu6PJX1cuq',
  [DEV]: '1kkcdeFLY15iaQy5ocEtYaZcquEkis3T4Fjaxmy4',
  [LOCAL]: 'fake-api-key'
}
const API_KEY = API_KEY_OPTIONS[getCurrentEnv()]

const DEFAULT_COLLECTION_ID_OPTIONS = {
  [PROD]: '44e13f1e-0689-4a52-b444-ec58575d8edb',
  [DEV]: '12755035-43c4-4180-a0ed-709e541ecc15',
  [LOCAL]: '12755035-43c4-4180-a0ed-709e541ecc15'
}
const DEFAULT_COLLECTION_ID = DEFAULT_COLLECTION_ID_OPTIONS[getCurrentEnv()]

module.exports = {
  WEB_URL,
  FUNCTIONS_URL,
  API_URL,
  ASSETS_URL,
  API_KEY,
  WEBHOOK_HANDLER_URL,
  DEFAULT_COLLECTION_ID,
  FIREBASE_CONFIG
}

if (process.env.NODE_ENV !== 'production') console.log('  **ENV VARS**: ', module.exports, '**Process VARS**', process.env)
