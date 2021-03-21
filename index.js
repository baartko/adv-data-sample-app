const express = require('express')
const app = express()
const port = 3000

const csv = require('./api/csv')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/csv', csv)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
