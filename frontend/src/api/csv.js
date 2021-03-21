const ok = ({ message, ...rest }) => ({ ok: true, message, ...rest })
const fail = ({ message, ...rest }) => ({ ok: false, message, ...rest })

export const getCsvData = () => new Promise((resolve, reject) => {
  return fetch('http://localhost:3000/csv/data', {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(data => resolve(ok({ response: data, message: 'Request Loaded' })))
    .catch(err => {
      return reject(fail({ response: {}, message: err.message }))
    })
})