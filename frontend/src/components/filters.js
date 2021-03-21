import { useState, useCallback, useEffect } from 'react'
import withStyles from 'react-jss'
import Select from 'react-select'
import cls from 'classnames'
import makeAnimated from 'react-select/animated';

import camelCase from 'lodash/kebabCase'

const animatedComponents = makeAnimated();

const buildSelectOptions = (data, appendAll) => {
  const mapToOptions = o => ({
    value: camelCase(o),
    label: o
  })

  let options = data.map(mapToOptions)
  
  if (appendAll) {
    options = [mapToOptions('All'), ...options]
  }

  return options
}

const styles = ({ error, success, disabled }) => {
  const filtersPadding = 20

  return {
    error,
    success,
    container: {
      background: '#dcf3fe',
      padding: filtersPadding,
      position: 'relative',
      width: '25%',

      '& button.disabled': disabled
    },
    title: {
      fontWeight: 500,
      margin: 0,
    },
    button: {
      bottom: filtersPadding,
      position: 'absolute',
      right: filtersPadding
    },
    menuList: {
      height: 300,
      overflowY: 'auto'
    },
  }
}

const difference = (source1, source2) => source1.filter(x => !source2.includes(x)).concat(source2.filter(x => !source1.includes(x)))

const Filters = ({ classes, data, state: { appliedFilters, selectedCampaign, selectedDatasources }, events: { setAppliedFilters, setDatasources, setCampaign } }) => {
  const campaignOptions = buildSelectOptions(data.campaigns, true).slice(0, 500)
  const datasourceOptions = buildSelectOptions(data.datasources)
  const [message, setMessage] = useState('')
  const [initPhase, setInitPhase] = useState(true)
  const [ok, setOk] = useState(null)

  useEffect(() => setInitPhase(false), [])
  useEffect(() => {
    const applied = difference(appliedFilters.selectedDatasources, selectedDatasources)

    if (!applied.length && selectedDatasources.length) {
      setMessage('Selected filters are already applied.')
      setOk(true)
    }
  }, [appliedFilters, selectedDatasources])
  
  const updateMessage = (data) => {
    const template = type => `You need to provide a <strong>${type}</strong> you want to check against.`
    
    if (!data.length) {
      setMessage(template('datasource'))
      setOk(false)
      return
    }

    const applied = difference(appliedFilters.selectedDatasources, data)
    if (!applied.length && selectedDatasources.length) {
      setMessage('Selected filters are already applied.')
      setOk(true)
      return
    }

    setMessage('')
  }

  const filtersHasChanged = () => {
    const campaignChanged = appliedFilters.selectedCampaign !== selectedCampaign
    const datasourcesChanged = difference(appliedFilters.selectedDatasources, selectedDatasources)
    
    return selectedDatasources.length > 0 && (campaignChanged || datasourcesChanged.length > 0)
  }

  const onApplyClick = useCallback(ev => {
    const el = ev.target

    // block further processing when APPLY is disabled
    if (el.classList.contains('disabled')) {
      return
    }

    // update message based on selection
    updateMessage(selectedDatasources)

    // Prevent applying filters when no datasource is selected
    if (!selectedDatasources.length) return

    setAppliedFilters({
      selectedDatasources,
      selectedCampaign
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDatasources, selectedCampaign, setAppliedFilters]);

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>Filter dimension values</h3>
      <h4>Datasource</h4>
      <Select
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        placeholder={'Choose...'}
        options={datasourceOptions}
        onChange={selected => {
          setDatasources(selected.map(item => item.label))
          updateMessage(selected.map(item => item.label))
        }}
      />

      <h4>Campaign</h4>
      <Select
        placeholder={'Choose...'}
        options={campaignOptions}
        onChange={selected => {
          setCampaign(selected.label)
        }}
        defaultValue={[campaignOptions[0]]}
      />

      {message && (
        <p 
          className={cls({
            [classes.error]: !ok,
            [classes.success]: ok
          })}
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
      )}
      {!initPhase && <button className={cls(classes.button, { 'disabled': initPhase || !filtersHasChanged() })} onClick={onApplyClick}>Apply</button>}
    </div>
  )
}

export default withStyles(styles)(Filters)
