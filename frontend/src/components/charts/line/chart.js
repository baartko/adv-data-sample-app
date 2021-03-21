import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js'
import { addOffset, formatDate, sumClicksPerDay, sumImpressionsPerDay } from '../../../utils'
import LineChartOptions from './options'
import LineChartDatasets from '../datasets';

function LineChart ({ data, source, selected }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) {
      return
    }
  
    const context = ref.current.getContext('2d')
  
    const clicks = sumClicksPerDay(data, {
      campaign: selected.campaign,
      datasources: selected.datasources,
      source
    })
    const impressions = sumImpressionsPerDay(data, {
      campaign: selected.campaign,
      datasources: selected.datasources,
      source
    })
  
    new Chart(context, {
      type: 'line',
      data: {
        labels: addOffset([...new Set(data.map(o => o.Date))]).map(x => formatDate(x)),
        datasets: LineChartDatasets({ dataset1: clicks, dataset2: impressions })
      },
      options: LineChartOptions
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.campaign, selected.datasources])

  return (
    <div>
      <canvas id='lineChartCanvas' ref={ref} />
    </div>
  )
}

export default LineChart