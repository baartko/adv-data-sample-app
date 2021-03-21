const LineChartDatasets = ({ dataset1, dataset2 }) => [{
  label: 'Clicks',
  borderColor: '#106490',
  fill: false,
  data: dataset1,
  yAxisID: 'A'
},
{
  label: 'Impressions',
  borderColor: '#178ecd',
  fill: false,
  data: dataset2,
  yAxisID: 'B'
}]

export default LineChartDatasets