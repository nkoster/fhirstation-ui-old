import { useState, useEffect } from 'react'
import './App.css'
import { TextField, ThemeProvider, createMuiTheme } from '@material-ui/core'
import { green, orange } from '@material-ui/core/colors'
import axios from 'axios'
import Lister from './components/Lister'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[800],
    },
    secondary: {
      main: green[700]
    }  
  }
})

function App() {

  const [query, setQuery] = useState('')
  const [data, setData] = useState([])

  const onChange = async evt => setQuery(evt.target.value)

  useEffect(async _ => {
    if (query) {
      try {
        await axios.post('http://localhost:3334/api/v1/search/', {
          search: query
        }, {
          mode: 'no-cors'
        })
        .then(res => {
          setData(res.data)
        })        
      } catch(err) {
        console.warn(err.message)
        setData([])
      }
    } else {
      setData([])
    }
  }, [query])

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: '100%' }}>
          <div style={{ display: 'inline-block' }}></div>
          <ThemeProvider theme={theme}>
            <TextField
              style={{ width: '80%', margin: 20 }}
              margin='dense'
              variant='standard'
              onChange={onChange}
              value={query}
              color='primary'
              type='search'
              label='search'
              placeholder='...'
            /> {/* text color in App.css: input */}
          </ThemeProvider>
        </div>
        <Lister data={data} />
      </header>
    </div>
  )

}

export default App
