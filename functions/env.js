const PROD = 'konch-d78ab'
const DEV = 'konch-dev-90dd4'
const LOCAL = 'local'

const getEnv = () => {
  if (process.env.API === LOCAL) return LOCAL
  if (!process.env.GCLOUD_PROJECT || process.env.GCLOUD_PROJECT === 'konch-dev-90dd4') {
    return DEV
  }
  return PROD
}

const API_URL_OPTIONS = {
  [PROD]: 'https://knch.io/v1',
  [DEV]: 'https://dev.knch.io/v1',
  [LOCAL]: 'http://localhost:3000'
}
const API_URL = API_URL_OPTIONS[getEnv()]

const API_KEY_OPTIONS = {
  [PROD]: '1kkcdeFLY15iaQy5ocEtYaZcquEkis3T4Fjaxmy4',
  [DEV]: '1kkcdeFLY15iaQy5ocEtYaZcquEkis3T4Fjaxmy4',
  [LOCAL]: 'fake-api-key'
}
const API_KEY = API_KEY_OPTIONS[getEnv()]

module.exports = {
  API_KEY,
  API_URL
}
