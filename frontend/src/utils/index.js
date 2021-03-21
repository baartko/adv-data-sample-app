import groupBy from "lodash/groupBy"
import get from 'lodash/get'
import moment from 'moment'

const OFFSET = 7
const SOURCE_DATE_FORMAT = 'DD.MM.YYYY'
const OUTPUT_DATE_FORMAT = 'DD MMM'

export const addOffset = data => data.filter((o, k) => !(k % OFFSET) && o)

export const formatDate = date => moment(date, SOURCE_DATE_FORMAT).format(OUTPUT_DATE_FORMAT)

const filterByCampaignAndDatasource = ({ campaign, datasources, source, grouped, key }) => {
  let filtered = []

  const campaignChanged = campaign !== 'All'
  if (campaignChanged) {
    filtered[key] = grouped[key].filter(o => o.Campaign === campaign)
  }

  const allDatasourceSelected = source.datasources.length !== datasources.length
  const atleastOneDatasourceSelected = datasources.length

  if (atleastOneDatasourceSelected && allDatasourceSelected) {
    filtered[key] = grouped[key].filter(o => datasources.includes(o.Datasource))
  }

  return filtered
}

export const sumClicksPerDay = (data, options) => {
  let clicks = []
  const grouped = groupBy(data, 'Date')

  for (let key in grouped) {
    if (grouped.hasOwnProperty(key)) {
      const filtered = filterByCampaignAndDatasource({
        ...options,
        grouped,
        key
      })

      clicks.push((get(filtered[key], 'length') ? filtered : grouped)[key].map(o => parseInt(o.Clicks)))
    }
  }
  
  return addOffset(clicks).map(o => o.reduce((a, b) => a + b, 0))
}

export const sumImpressionsPerDay = (data, options) => {
  let result = []
  const grouped = groupBy(data, 'Date')
  
  for (let key in grouped) {
    if (grouped.hasOwnProperty(key)) {
      const filtered = filterByCampaignAndDatasource({
        ...options,
        grouped,
        key
      })

      result.push((get(filtered[key], 'length') ? filtered : grouped)[key].map(o => {
        return o.Impressions != null ? parseInt(o.Impressions) : null
      }))
    }
  }
  
  return addOffset(result).map(o => o.reduce((a, b) => a + b))
}