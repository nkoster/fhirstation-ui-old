import { useState, useEffect, useRef } from 'react'
import './App.css'
import { TextField, ThemeProvider, createMuiTheme, CircularProgress } from '@material-ui/core'
import { green, orange } from '@material-ui/core/colors'
import axios from 'axios'
import Lister from './components/Lister'
// import fhirDepartment from '../src/pix/lego-fhir-station-2.png'
import fhirDepartment1 from '../src/pix/fire1.png'
import fhirDepartment2 from '../src/pix/fire2.png'
import { ScaleLoader } from 'react-spinners'

const LIMIT = 52

const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[800],
    },
    secondary: {
      main: orange[800]
    }
  }
})

const App = _ => {

  const [queryIdentifierValue, setQueryIdentifierValue] = useState('')
  const [queryKafkaOffset, setQueryKafkaOffset] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const img1 = useRef()
  const img2 = useRef()

  const onChangeIdentifierValue = evt => {
    setQueryIdentifierValue(evt.target.value)
    setError('')
    // evt.target.value || setData([])
  }

  const onChangeKafkaOffset = evt => {
    setQueryKafkaOffset(evt.target.value)
    setError('')
    // evt.target.value || setData([])
  }

  useEffect(_ => {
    const timeout = setTimeout(async _ => {
      localStorage.setItem('queryIdentifierValue', queryIdentifierValue ? queryIdentifierValue : '')
      localStorage.setItem('queryKafkaOffset', queryKafkaOffset ? queryKafkaOffset : '')
      if (queryIdentifierValue || queryKafkaOffset) {
        try {
          setLoading(true)
          await axios.post('http://localhost:3333/api/v1/search/', {
            search: { queryIdentifierValue, queryKafkaOffset }
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
  }, [queryIdentifierValue, queryKafkaOffset])
  
  useEffect(_ => {
    setQueryIdentifierValue(localStorage.getItem('queryIdentifierValue'))
    setQueryKafkaOffset(localStorage.getItem('queryKafkaOffset'))
    setTimeout(_ => {
      img1.current.style.height = '0px'
      setTimeout(_ => img1.current.style.display = 'none', 1005)
      // if (img2.current) img2.current.style.opacity = '1'
      // setTimeout(_ => img.current.style.height = '0px', 2000)
    }, 1000)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider theme={theme}>
          <div style={{ width: '100%' }}>
            <div>
              <img ref={img1} style={fire1Style} src={fhirDepartment1} alt='FHIR department' />
            </div>
            <div style={{ display: 'inline-flex', width: '90%' }}>
              <TextField
                style={{ flex: '1', margin: 10 }}
                margin='dense'
                variant='standard'
                onChange={onChangeIdentifierValue}
                value={queryIdentifierValue}
                color='primary'
                type='search'
                label='Search Identifier Value'
                placeholder='...'
              /> {/* text color in App.css: input */}
              <TextField
                style={{ flex: '1', margin: 10 }}
                margin='dense'
                variant='standard'
                onChange={onChangeKafkaOffset}
                value={queryKafkaOffset}
                color='primary'
                type='search'
                label='Search Kafka Offset'
                placeholder='...'
              /> {/* text color in App.css: input */}
            </div>
            {data.length > 0 && <div style={{ display: 'inline-block', paddingTop: '20px', fontSize: '14px' }}>
              <br />{data.length > 50 ? '50+' : data.length}<br />row{data.length === 1 ? '' : 's'}
            </div>}
            <div></div>
            {loading ? <ScaleLoader color='orange'/> : (data.length > 0 && <Lister data={data} limit={LIMIT} />)}
            {error && <p style={{ fontSize: '18px', color: 'black' }}>{error}</p>}
            {data.length === 0 && !loading && !error && (queryIdentifierValue || queryKafkaOffset) ? <p style={{ fontSize: '18px', color: 'black' }}>No records found</p> : null}
            {(!queryIdentifierValue && !queryKafkaOffset) && <div><img ref={img2} style={fire2Style} src={fhirDepartment2} alt='FHIR Station' /></div>}
          </div>
        </ThemeProvider>
      </header>
    </div>
  )

}

const fire1Style = {
  padding: 0, margin: 0,
  height: 300,
  transition: 'height 1s'
}

const fire2Style = {
  padding: 0, margin: 0,
  height: 250,
  opacity: 1,
  transition: 'opacity 1s'
}

export default App
