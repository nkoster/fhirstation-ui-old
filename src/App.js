import { useState, useEffect, useRef } from 'react'
import './App.css'
import { TextField, ThemeProvider, createMuiTheme } from '@material-ui/core'
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
  const img = useRef()
  const onChange = evt => {
    setQuery(evt.target.value)
    evt.target.value || setData([])
  }

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

  useEffect(_ => {
   setTimeout(_ => {
     img.current.style.height = '100px'
     setTimeout(_ => img.current.style.height = '0', 2000)
   }, 2000)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: '100%' }}>
          <div style={{ display: 'inline-block' }}>
            <img ref={img} style={imgStyle} src={fhirDepartment} alt='FHIR department' />
          </div>
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

const imgStyle = {
  height: 700,
  transition: 'height 0.5s'
}

export default App
