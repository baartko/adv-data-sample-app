import { useState } from 'react'
import { Link } from 'react-router-dom'
import SpinResolver from '../components/spinResolver'
import LineChart from '../components/charts/line/chart'
import Filters from '../components/filters'
import { getCsvData } from '../api/csv'
import withStyles from 'react-jss'
import theme from '../theme'
import cls from 'classnames'

const styles = ({ disabled }) => {
  return {
    app: {
      display: 'flex',
      height: 'inherit',
      justifyContent: 'center',
      margin: '0 auto',
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 1240,

      '& .spinner': {
        position: 'relative',
        top: '50%',
      },
      '& button': theme.buttonStyles,
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: 'auto',
      padding: 20,
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 1200,

      '& *': {
        boxSizing: 'border-box'
      }
    },
    flexItem: {
      flex: '1 1 100%',
      padding: [20, 0],
      textAlign: 'center',

      '& $headerTitle': {
        fontWeight: 400,
        whiteSpace: 'pre-line'
      },
    },
    headerTitle: {},
    content: {
      width: '75%'
    },
    error: {
      padding: [20, 0],
      textAlign: 'center',
      whiteSpace: 'pre-line'
    },
    goBack: {
      position: 'absolute',
      top: -30,
      fontSize: 40,
      color: '#000',
      
      '&:visited': {
        color: '#000'
      }
    }
  }
}

function App({ classes }) {
  const [selectedCampaign, setCampaign] = useState('All')
  const [selectedDatasources, setDatasources] = useState([])
  const [appliedFilters, setAppliedFilters] = useState({ selectedDatasources, selectedCampaign })

  const getDatasetMessage = (sources) => {
    const applied = appliedFilters.selectedDatasources
    if (!applied.length || sources.length === applied.length) {
      return 'Entire dataset'
    }
    return `Datasource: ${applied.map(d => `"${d}"`).join(', ')}`
  }

  return (
    <div className={classes.app}>
      <SpinResolver services={[getCsvData]}>
        {({ results: [{ response: { data, datasources, campaigns }, ok }] }) => {
          if (!ok) {
            const message = `Data could not be loaded.\nAPI Server is either down or has not been started.`

            return (
              <div className={classes.error}>{message}</div>
            )
          }

          return (
              <div className={classes.container}>
                <Link to="/">
                  <i className={cls('far fa-arrow-alt-circle-left', classes.goBack)} />
                </Link>
                
                <Filters
                  data={{ campaigns, datasources }}
                  state={{ appliedFilters, selectedCampaign, selectedDatasources }} 
                  events={{ setAppliedFilters, setDatasources, setCampaign }}
                />

                <div className={classes.content}>
                  <header className={classes.flexItem}>
                    <h2 className={classes.headerTitle}>
                      {`${getDatasetMessage(datasources)}
                      ${appliedFilters.selectedCampaign} Campaign`}
                    </h2>
                  </header>
                  <LineChart
                    data={data}
                    source={{ datasources }}
                    selected={{
                      campaign: appliedFilters.selectedCampaign,
                      datasources: appliedFilters.selectedDatasources
                    }}
                  />
                </div>
              </div>
          )
        }}
      </SpinResolver>
    </div>
  );
}

export default withStyles(styles)(App);
