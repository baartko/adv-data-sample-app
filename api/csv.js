const express = require('express')
const router = express.Router()
const parse = require('csv-parse')
const path = require('path')
const fs = require('fs')

const isArrayOfArrays = (source) => {
  return Array.isArray(source) && Array.isArray(source[0])
}

/**
 * Extract data from CSV file into more suitable for us, JSON structure
 * As an effect we have new file (data.json) generated.
 */
router.get('/', function (req, res) {
  const data = []
  fs.createReadStream(path.join(__dirname, 'data.csv'))
    .pipe(parse({ delimiter: ',' }))
    .on('data', response => data.push(response))
    .on('end', () => {
      if (!isArrayOfArrays(data)) {
        res.end('CSV data is not in correct format.')
      }

      const csvHeaders = data.slice(0, 1)[0]
      const csvData = data.slice(1)

      const result = csvData.map(x => x.reduce((accumulator, value, key) => {
        if (!value) {
          return accumulator
        }
        return { ...(accumulator || []), [csvHeaders[key]]: value }
      }, []))

      fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(result), (err, data) => {
        if (err) console.log('err', err)
        res.send(`File data.json successfuly generated.`)
      });
    })
})

/**
 * This is just serving data.json file content
 */
router.get('/data', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'data.json'));

  // We need [Campains] and [Dataources] as separate datasets
  // Doing extraction here
  
  /**
   * [
   *    {
   *      Date: '01.01.2019',
   *      Datasource: 'Google Adwords',
   *      Campaign: 'New General Campaign - SWE - Desktop',
   *      Clicks: '5',
   *      Impressions: '114'
   *    }
   * ]
   */
  const result = JSON.parse(data) // Array<Object>
  
  const datasources = [...new Set(result.map(o => o.Datasource))] // Array<String> -> ['Facebook Ads', 'Google Adwords']
  const campaigns = [...new Set(result.map(o => o.Campaign))] // Array<String> -> ['Like Ads', 'B2B - Leads']

  res.json({ datasources, campaigns, data: result })
})

module.exports = router