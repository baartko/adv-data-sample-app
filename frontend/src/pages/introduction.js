import withStyles from 'react-jss'
import { Link } from 'react-router-dom'

const styles = () => ({
  container: {
    background: '#e1f1fd',
    left: '50%',
    padding: 50,
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000
  },
  list: {
    listStyleType: 'none',
    padding: 0,

    '& label': {
      marginLeft: 10
    }
  }
})

const Introduction = ({ classes }) => {
  return (
    <div className={classes.container}>
      <h2>There's still a place for improvements:</h2>      
      <ul className={classes.list}>
        <li>
          <input id="custom-select" type="checkbox" disabled />
          <label for="custom-select">Custom Select Performance</label>
        </li>
        <li>
          <input id="prop-types" type="checkbox" disabled />
          <label for="prop-types">Missing PropTypes</label>
        </li>
        <li>
          <input id="refactor" type="checkbox" disabled />
          <label for="refactor">Check/Refactor the code against some flaws</label>
        </li>
      </ul>

      <h2>But anyway, go ahead and check the results:</h2>

      <Link to="/home">Advertising Data ETL-V</Link>
    </div>
  )
}

export default withStyles(styles)(Introduction)