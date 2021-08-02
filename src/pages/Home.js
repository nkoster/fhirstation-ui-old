import { useState, useEffect, useRef } from 'react'
import '../App.css'
import { TextField, ThemeProvider, createMuiTheme } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { green, orange } from '@material-ui/core/colors'
import axios from 'axios'
import Lister from '../components/Lister'
import fhirDepartment2 from '../../src/pix/fire2.png'
import { ScaleLoader } from 'react-spinners'
import { Route, useLocation } from 'react-router-dom'
import Details from '../pages/Details'
import Timer from '../components/Timer'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { eraseCookie } from '../utils/cookies'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

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

const Home = ({accessToken, setTokens}) => {

  const useStyles = makeStyles({
    '@global': {
        '.MuiAutocomplete-option[data-focus="true"]': {
          background: 'darkorange',
          color: 'white'
        }
    }
  })

  const styles = useStyles()

  const [queryIdentifierValue, setQueryIdentifierValue] = useState('')
  const [queryKafkaOffset, setQueryKafkaOffset] = useState('')
  const [queryKafkaTopic, setQueryKafkaTopic] = useState('')
  const [queryIdentifierType, setQueryIdentifierType] = useState('')
  const [queryId] = useState(Math.random().toString(20).substr(2))
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [topicList, setTopicList] = useState([])

  const defaultProps = {
    options: topicList
  }
  
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

  const onChangeKafkaTopic = (_, v) => {
    setQueryKafkaTopic(v)
    setError('')
  }

  const onChangeIdentifierType = evt => {
    setQueryIdentifierType(evt.target.value)
    setError('')
  }

  useEffect(async _ => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
      const response = await axios.post(
        'https://api.fhirstation.net/function/topiclister',
        config
      )
      let list = response.data.map(i => i.kafka_topic)
      list.unshift('')
      setTopicList(list.sort())
    } catch(err) {
      console.log(err.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const seeker = async url => {
    cancelTokenSource.cancel()
    try {
      setLoading(true)
      await axios.post(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cancelToken: cancelTokenSource.token,
        search: {
          queryIdentifierValue, queryKafkaOffset, queryKafkaTopic,
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
  }

  useEffect(_ => {
    const timeout = setTimeout(_ => {
      localStorage.setItem('queryIdentifierValue', queryIdentifierValue ? queryIdentifierValue : '')
      localStorage.setItem('queryKafkaOffset', queryKafkaOffset ? queryKafkaOffset : '')
      localStorage.setItem('queryKafkaTopic', queryKafkaTopic ? queryKafkaTopic : '')
      localStorage.setItem('queryIdentifierType', queryIdentifierType ? queryIdentifierType : '')
      if (queryIdentifierValue || queryKafkaOffset || queryKafkaTopic || queryIdentifierType) {
        seeker('https://api.fhirstation.net/function/seeker')
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

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = evt => {
    setAnchorEl(evt.currentTarget)
  }

  const handleClose = _ => {
    setAnchorEl(null)
  }

  const handleLogout = _ => {
    eraseCookie('tokens')
    setTokens({})
  }

  const options = [
    'Logout'
  ]

  const ITEM_HEIGHT = 48

  return (
    <div className="App">
      <ClickAwayListener onClickAway={handleClose}>
        <IconButton
          style={{position: 'fixed', right: 1, top: 1, zIndex: 100}}
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
      </ClickAwayListener>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key='Logout' onClick={handleLogout}>
            {option}
          </MenuItem>
        ))}
      </Menu>
      <Route path="/details/:topic/:partition/:offset" component={Details} />
      {location.pathname === '/' &&
      <header className="App-header">
        <ThemeProvider theme={theme}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'inline-flex', width: '90%', paddingBottom: '12px' }}>
              <Autocomplete
                ListboxProps={{ style: { maxHeight: '600px' } }}
                {...defaultProps}
                style={{ flex: '1.5', margin: 7, marginRight: 10, textAlign: 'left'}}
                margin='dense'
                variant='standard'
                onChange={onChangeKafkaTopic}
                value={queryKafkaTopic}
                classes={styles}
                renderInput={params => 
                  <TextField
                    {...params}
                    placeholder='none'
                    label={`Kafka Topic (${topicList.length === 0 ? 'loading...' : topicList.length - 1})`}
                  />}
              />
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
            {loading ?
              <div>
                <ScaleLoader color='orange'/>
                <p style={{ fontSize: '16px'}}>please wait, querying database... <Timer /></p>
              </div> : (data.length > 0 && <Lister data={data} limit={LIMIT} />)}
            {error && <p style={{ fontSize: '18px', color: 'black' }}>{error}</p>}
            {data.length === 0 &&
              !loading && !error && (queryIdentifierValue || queryKafkaOffset || queryKafkaTopic || queryIdentifierType) ?
              <p style={{ fontSize: '16px', color: '#333', marginTop: 50 }}>please adjust your search...</p> :
              null}
            {(!queryIdentifierValue && !queryKafkaOffset && !queryKafkaTopic && !queryIdentifierType) &&
              <div>
                <img ref={img2} style={fire2Style} src={fhirDepartment2} alt='FHIR Station' />
              </div>}
          </div>
        </ThemeProvider>
      </header>}
    </div>
  )

}

const fire2Style = {
  padding: 0, margin: 0,
  height: 250,
  opacity: 1,
  transition: 'opacity 1s'
}

export default Home
