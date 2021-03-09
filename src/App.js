import { useState, useEffect, useRef } from 'react'
import './App.css'
import { TextField, ThemeProvider, createMuiTheme, CircularProgress } from '@material-ui/core'
import { green, orange } from '@material-ui/core/colors'
import axios from 'axios'
import Lister from './components/Lister'
import fhirDepartment from '../src/pix/lego-fhir-station-2.png'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[800],
    },
    secondary: {
      main: orange[800]
    }  
  }
})

const App = _ => {

  const [query, setQuery] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const img = useRef()
  const onChange = evt => {
    setQuery(evt.target.value)
    evt.target.value || setData([])
  }

  useEffect(_ => {
    const timeout = setTimeout(async _ => {
      if (query) {
        try {
          setLoading(true)
          await axios.post('http://localhost:3334/api/v1/search/', {
            search: query
          }, {
            mode: 'no-cors'
          })
          .then(res => {
            setData(res.data)
            setLoading(false)
          })
        } catch(err) {
          console.warn(err.message)
          setData([])
          setLoading(false)
        }
      } else {
        setData([])
      }
    }, 250)
    return _ => clearTimeout(timeout)
  }, [query])
  
  useEffect(_ => {
   setTimeout(_ => {
     img.current.style.height = '100px'
     setTimeout(_ => img.current.style.height = '0', 1000)
   }, 1000)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
      <ThemeProvider theme={theme}>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'inline-block' }}>
            <img ref={img} style={imgStyle} src={fhirDepartment} alt='FHIR department' />
          </div>
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
          </div>
          {loading ? <CircularProgress color='primary' /> : <Lister data={data} />}
        </ThemeProvider>
      </header>
    </div>
  )

}

const imgStyle = {
  height: 700,
  transition: 'height 0.5s'
}

export default App
