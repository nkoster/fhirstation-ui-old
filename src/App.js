import './App.css'
import Home from './pages/Home'
import { Route, Switch } from 'react-router-dom'

const App = _ => {

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      {/* <Route path="/:id" component={UserPage} /> */}
    </Switch>
  )

}

export default App
