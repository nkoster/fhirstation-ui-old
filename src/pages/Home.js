import { useState, useEffect, useRef } from 'react'
import '../App.css'
import { TextField, ThemeProvider, createMuiTheme } from '@material-ui/core'
import { green, orange } from '@material-ui/core/colors'
import axios from 'axios'
import Lister from '../components/Lister'
import fhirDepartment2 from '../../src/pix/fire2.png'
import { ScaleLoader } from 'react-spinners'
import { Route, useLocation } from 'react-router-dom'
import Details from '../pages/Details'

const LIMIT = 52

const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[800],
    },
    secondary: {
      main: green[800]
    }
  }
})

const cancelTokenSource = axios.CancelToken.source()

const queryId = Math.random().toString(20).substr(2)

const Home = _ => {

  const [queryIdentifierValue, setQueryIdentifierValue] = useState('')
  const [queryKafkaOffset, setQueryKafkaOffset] = useState('')
  const [queryKafkaTopic, setQueryKafkaTopic] = useState('')
  const [queryIdentifierType, setQueryIdentifierType] = useState('')

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const img1 = useRef()
  const img2 = useRef()

  const location = useLocation()

  const onChangeIdentifierValue = evt => {
    setQueryIdentifierValue(evt.target.value)
    setError('')
  }

  const onChangeKafkaOffset = evt => {
    setQueryKafkaOffset(evt.target.value)
    setError('')
  }

  const onChangeKafkaTopic = evt => {
    setQueryKafkaTopic(evt.target.value)
    setError('')
  }

  const onChangeIdentifierType = evt => {
    setQueryIdentifierType(evt.target.value)
    setError('')
  }

  useEffect(_ => {
    const timeout = setTimeout(async _ => {
      localStorage.setItem('queryIdentifierValue', queryIdentifierValue ? queryIdentifierValue : '')
      localStorage.setItem('queryKafkaOffset', queryKafkaOffset ? queryKafkaOffset : '')
      localStorage.setItem('queryKafkaTopic', queryKafkaTopic ? queryKafkaTopic : '')
      localStorage.setItem('queryIdentifierType', queryIdentifierType ? queryIdentifierType : '')
      if (queryIdentifierValue || queryKafkaOffset || queryKafkaTopic || queryIdentifierType) {
        cancelTokenSource.cancel()
        try {
          setLoading(true)
            /* Old API URL, not FaaS: https://api.fhirstation.net/api/v1/search/ */
            await axios.post('https://api.fhirstation.net/function/seeker', {
            cancelToken: cancelTokenSource.token,
            search: { queryIdentifierValue, queryKafkaOffset, queryKafkaTopic, queryIdentifierType },
            queryId
          })
          .then(res => {
            setData(res.data)
            setLoading(false)
          })
        } catch(err) {
          console.warn(err.message)
          setLoading(false)
        }
      } else {
        setLoading(false)
        setData([])
      }
    }, 500)
    if (!queryIdentifierValue && !queryKafkaOffset && !queryKafkaTopic && !queryIdentifierType)
      setLoading(false)
    return _ => clearTimeout(timeout)
  }, [queryIdentifierValue, queryKafkaOffset, queryKafkaTopic, queryIdentifierType])
  
  useEffect(_ => {
    setQueryIdentifierValue(localStorage.getItem('queryIdentifierValue'))
    setQueryKafkaOffset(localStorage.getItem('queryKafkaOffset'))
    setQueryKafkaTopic(localStorage.getItem('queryKafkaTopic'))
    setQueryIdentifierType(localStorage.getItem('queryIdentifierType'))
  }, [])

  return (
    <div className="App">
      <Route path="/details/:topic/:offset" component={Details} />
      {location.pathname === '/' &&
      <header className="App-header">
        <ThemeProvider theme={theme}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'inline-flex', width: '90%', paddingBottom: '12px' }}>
              <TextField
                style={{ flex: '1', margin: 10 }}
                margin='dense'
                variant='standard'
                onChange={onChangeKafkaTopic}
                value={queryKafkaTopic}
                color='primary'
                type='search'
                label='Search Kafka Topic'
                placeholder='...'
                spellCheck={false}
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
                spellCheck={false}
              /> {/* text color in App.css: input */}
              <TextField
                style={{ flex: '1', margin: 10 }}
                margin='dense'
                variant='standard'
                onChange={onChangeIdentifierType}
                value={queryIdentifierType}
                color='primary'
                type='search'
                label='Search Identifier Type'
                placeholder='...'
                spellCheck={false}
                /> {/* text color in App.css: input */}
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
                spellCheck={false}
                /> {/* text color in App.css: input */}
            </div>
            {data.length > 0 && <div style={{ display: 'inline-block', paddingTop: '20px', fontSize: '14px' }}>
              <br />{data.length > 50 ? '50+' : data.length}<br />row{data.length === 1 ? '' : 's'}
            </div>}
            <div></div>
            {loading ? <ScaleLoader color='orange'/> : (data.length > 0 && <Lister data={data} limit={LIMIT} />)}
            {error && <p style={{ fontSize: '18px', color: 'black' }}>{error}</p>}
            {data.length === 0 && !loading && !error && (queryIdentifierValue || queryKafkaOffset || queryKafkaTopic || queryIdentifierType) ? <p style={{ fontSize: '18px', color: 'black' }}>No records found</p> : null}
            {(!queryIdentifierValue && !queryKafkaOffset && !queryKafkaTopic && !queryIdentifierType) && <div><img ref={img2} style={fire2Style} src={fhirDepartment2} alt='FHIR Station' /></div>}
          </div>
        </ThemeProvider>
      </header>}
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

export default Home
