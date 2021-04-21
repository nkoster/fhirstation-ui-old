import { useState, useEffect, useRef } from 'react'
import '../App.css'
import { TextField, ThemeProvider, createMuiTheme, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core'
import { green, orange } from '@material-ui/core/colors'
import axios from 'axios'
import Lister from '../components/Lister'
import fhirDepartment2 from '../../src/pix/fire2.png'
import { ScaleLoader } from 'react-spinners'
import { Route, useLocation } from 'react-router-dom'
import Details from '../pages/Details'
import Timer from '../components/Timer'

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

// const topicList = [
//   'none',
//   'fhir3.databus.portavita.pvt_amstelveen.episodeofcare',
//   'fhir3.databus.portavita.pvt_amstelveen.medication',
//   'fhir3.databus.portavita.pvt_amstelveen.basic',
//   'fhir3.databus.portavita.pvt_amstelveen.encounter',
//   'fhir3.databus.portavita.pvt_amstelveen.patient',
//   'fhir3.databus.portavita.pvt_amstelveen.careteam',
//   'fhir3.databus.portavita.pvt_amstelveen.observation',
//   'fhir3.databus.portavita.pvt_amstelveen.organization',
//   'fhir4.capybara.firefly.medicom.observation',
//   'fhir3.databus.portavita.pvt_amstelveen.coverage',
//   'fhir3.databus.portavita.pvt_amstelveen.communication',
//   'fhir3.databus.portavita.pvt_amstelveen.practitioner',
//   'fhir3.databus.portavita.pvt_amstelveen.practitionerrole'
// ]

const cancelTokenSource = axios.CancelToken.source()

const Home = _ => {

  const [queryIdentifierValue, setQueryIdentifierValue] = useState('')
  const [queryKafkaOffset, setQueryKafkaOffset] = useState('')
  const [queryKafkaTopic, setQueryKafkaTopic] = useState('')
  const [queryIdentifierType, setQueryIdentifierType] = useState('')
  const [queryId] = useState(Math.random().toString(20).substr(2))
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [topicList, setTopicList] = useState([])

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

  useEffect(async _ => {
    try {
      const response = await axios.post('https://api.fhirstation.net/function/topiclister')
      let list = response.data.map(i => i.kafka_topic)
      list.unshift('none')
      setTopicList(list)
    } catch(err) {
      console.log(err.message)
    }
  }, [])

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
            search: {
              queryIdentifierValue, queryKafkaOffset,
              queryKafkaTopic: queryKafkaTopic !== 'none' ? queryKafkaTopic : '',
              queryIdentifierType
            },
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
    if (!queryIdentifierValue && !queryKafkaOffset && !queryKafkaTopic && !queryIdentifierType) {
      setLoading(false)
    }
    return _ => {
      clearTimeout(timeout)
    }
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
              <FormControl
                  style={{ flex: '1.5', margin: 10, marginRight: 20, textAlign: 'left'}}
                  margin='dense'
                  variant='standard'              
              >
                <InputLabel id='labeltje'>Kafka Topic &nbsp; ({topicList.length === 0 ? 'loading...' : topicList.length - 1})</InputLabel>
                <Select
                  labelId='labeltje'
                  value={queryKafkaTopic}
                  onChange={onChangeKafkaTopic}
                  label={'Kafka Topic (' + topicList.length - 1 + ')'}
                >{topicList.map(topic => {
                  const t = topic === 'none' ? <em style={{color:'gray'}}>none</em> : topic
                  return <MenuItem value={topic}>{t}</MenuItem>
                })}
                </Select>
              </FormControl>
              <TextField
                style={{ flex: '0.7', margin: 10 }}
                margin='dense'
                variant='standard'
                onChange={onChangeKafkaOffset}
                value={queryKafkaOffset}
                color='primary'
                type='search'
                label='Kafka Offset'
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
                label='Identifier Type'
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
                label='Identifier Value'
                placeholder='...'
                spellCheck={false}
                /> {/* text color in App.css: input */}
            </div>
            {data.length > 0 && <div style={{ display: 'inline-block', paddingTop: '20px', fontSize: '14px' }}>
              <br />{data.length > 50 ? '50+' : data.length}<br />row{data.length === 1 ? '' : 's'}
            </div>}
            <div></div>
            {loading ? <div><ScaleLoader color='orange'/><p style={{ fontSize: '16px'}}>please wait, querying database... <Timer /></p></div> : (data.length > 0 && <Lister data={data} limit={LIMIT} />)}
            {error && <p style={{ fontSize: '18px', color: 'black' }}>{error}</p>}
            {data.length === 0 && !loading && !error && (queryIdentifierValue || queryKafkaOffset || queryKafkaTopic || queryIdentifierType) ? <p style={{ fontSize: '18px', color: '#333', marginTop: 50 }}>please adjust your search</p> : null}
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
