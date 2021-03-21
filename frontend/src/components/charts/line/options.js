const LineChartOptions = {
  responsive: true,
  tooltips: {
    enabled: true,
    displayColors: false,
    callbacks: {
      label: function (tooltipItem, data) {
        const dataset = data.datasets[tooltipItem.datasetIndex]
        const type = dataset?.label

        return `${type}: ${Intl.NumberFormat().format(tooltipItem.value)}`
      },
    },
  },
  legend: {
    display: true,
    position: 'bottom',
    onClick: () => {},
  },
  scales: {
    yAxes: [{
      id: 'A',
      type: 'linear',
      position: 'left',
      scaleLabel: {
        display: true,
        labelString: 'Clicks'
      },
      ticks: {
        beginAtZero: true,
        callback: label => Intl.NumberFormat().format(label)
      }
    }, {
      id: 'B',
      type: 'linear',
      position: 'right',
      scaleLabel: {
        display: true,
        labelString: 'Impressions'
      },
      ticks: {
        beginAtZero: true,
        callback: label => Intl.NumberFormat().format(label)
      }
    }]
  }
}

export default LineChartOptions