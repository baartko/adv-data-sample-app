import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './home'
import Introduction from './introduction'

const App = ({ classes }) => {
  return (
    <Router>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/">
          <Introduction />
        </Route>
      </Switch>
    </Router>
  )
}

export default App