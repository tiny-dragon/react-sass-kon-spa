const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const request = require('request-promise')
const { API_KEY, API_URL } = require('./env')
const cors = require('cors')({
  origin: true
})

exports.processWebook = functions.https.onRequest((req, res) => {
  console.log(req.method, req.body)
  if (req.method !== 'POST') return res.status(405).send({err: 'Method not allowed.'})
  const data = req.body
  if (!data) return res.status(421).send({err: 'Missing a valid payload.'})
  const collectionId = data.id
  if (!collectionId) return res.status(421).send({err: 'Missing a valid payload.'})

  admin
    .database()
    .ref(`/Collections/${collectionId}`)
    .set(data)

  return res.status(200).send({message: 'Saved successfully.'})
})

exports.test = functions.https.onRequest((req, res) => {
  const original = req.query.text
  return res.send(200, {message: original})
})

exports.getUser = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    console.log('dsffasfsfd')
    const idToken = req.query.idToken
    if (req.method !== 'GET') return res.status(403).send('Forbidden!')
    if (!idToken) return res.status(421).send('Missing Params')
    return new Promise((resolve, reject) => {
      admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
          console.log('decodedToken', decodedToken)
          const uid = decodedToken.uid
          const url = API_URL + '/user/' + uid
          console.log('Requesting', url)
          request({
            url,
            headers: {
              'x-api-key': API_KEY
            }
          }, (error, response, body) => {
            if (error) resolve(res.status(500).send(error))
            else {
              console.log(body, 'body')
              return res.status(200).send(JSON.parse(body).result)
            }
          })
        }).catch(function (error) {
          console.log('Issue getting user from token.')
          resolve(res.status(500).send(error))
        })
    }) // Promise
  }) // cors
})

/*
* ACTIONS WHEN CREATING A NEW USER FOR WEB
* TO CREATE A NEW API USER
*/

const createNewAPIUser = uid => {
  console.log('sending', uid)
  return new Promise((resolve, reject) => {
    const opts = {
      headers: {
        'x-api-key': API_KEY
      },
      method: 'POST',
      uri: API_URL + '/user',
      body: {
        userId: uid
      },
      json: true
    }
    request(opts).then(resolve).catch(reject)
  })
}

exports.createAPIUser = functions.https.onRequest((req, res) => {
  const uid = req.body.userId
  if (!uid) return res.send(421, {message: 'missing userId in POST body'})
  createNewAPIUser(uid)
    .then(data => {
      res.send(200, {message: JSON.parse(data)})
    })
    .catch(err => {
      res.send(500, {message: err})
    })
})

exports.newUser = functions.database.ref('/Users/{uid}').onCreate((event) => {
  const original = event.data.val()
  const uid = event.params.uid
  createNewAPIUser(uid)
    .then(data => {
      console.log('data', data)
    })
    .catch(err => {
      console.log('error', err)
    })
  console.log('New User', uid, original)
  return Promise.resolve('done')
})
