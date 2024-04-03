import konch from 'konch-sdk'
import { API_URL, API_KEY, ASSETS_URL } from './env'
konch.config({
  key: API_KEY,
  url: API_URL,
  bucket: ASSETS_URL.replace('http://', '')
})
export default konch
