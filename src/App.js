import { useState, useEffect, useRef } from 'react'
import './App.css'
import { TextField, ThemeProvider, createMuiTheme, CircularProgress } from '@material-ui/core'
import { green, orange } from '@material-ui/core/colors'
import axios from 'axios'
import Lister from './components/Lister'
import fhirDepartment from '../src/pix/lego-fhir-station-2.png'
import { ScaleLoader } from 'react-spinners'

const LIMIT = 51

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
  const [error, setError] = useState('')

  const img = useRef()
  const onChange = evt => {
    setQuery(evt.target.value)
    setError('')
    evt.target.value || setData([])
  }

  useEffect(_ => {
    const timeout = setTimeout(async _ => {
      localStorage.setItem('query', query ? query : '')
      if (query) {
        try {
          setLoading(true)
          await axios.post('https://api.fhirstation.net/api/v1/search/', {
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
          setError('Oh boy... ' + err.message)
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
    setQuery(localStorage.getItem('query'))
    setTimeout(_ => {
      img.current.style.height = '80px'
      setTimeout(_ => img.current.style.height = '90px', 2000)
    }, 2000)
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
          {loading ? <ScaleLoader color='#666'/> : error || <Lister data={data} limit={LIMIT} />}
          {error && <p style={{ fontSize: '18px', color: 'black' }}>{error}</p>}
          {data.length === 0 && !loading && !error && query ? <p style={{ fontSize: '18px', color: 'black' }}>No records found</p> : null}
        </ThemeProvider>
      </header>
    </div>
  )

}

const imgStyle = {
  padding: 0, margin: 0,
  height: 700,
  transition: 'height 0.5s'
}

export default App
