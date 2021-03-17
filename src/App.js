import './App.css'
import Home from './pages/Home'
import Details from './pages/Details'
import { Route, Switch } from 'react-router-dom'

const App = _ => {

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/details/:topic/:offset" component={Details} />
    </Switch>
  )

}

export default App
