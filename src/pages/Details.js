import React from 'react'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { ScaleLoader } from 'react-spinners'
import { useHistory } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import { ThemeProvider, createMuiTheme } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Grow from '@material-ui/core/Grow'
import { green, orange } from '@material-ui/core/colors'
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import Tooltip from '@material-ui/core/Tooltip'
import Timer from '../components/Timer'
import Rotate from '../components/Rotate'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[700]
    },
    secondary: {
      main: orange[700]
    }  }
})

const Details = props => {

  const [ messageObj, setMessageObj ] = useState({})
  const [ loading, setLoading ] = useState(false)
  const { topic, partition } = props.match.params
  const [ offset, setOffset ] = useState(props.match.params.offset)
  
  const history = useHistory()

  const isFirstRun = useRef(true)

  if (Number(partition) < 0) partition = '0'
  if (Number(offset) < 0) setOffset('0')

  useEffect(async _ => {
    const cancelTokenSource = axios.CancelToken.source()
    try {
      setLoading(true)
        await axios.post('https://offset.fhirstation.net/function/offsetter', {
        topic, offset, partition,
        cancelToken: cancelTokenSource.token
      })
      .then(res => {
        setMessageObj(res.data)
        setLoading(false)
        if (isFirstRun.current) {
          isFirstRun.current = false
        } else {
          history.push(`/details/${topic}/${partition}/${offset}`)
        }
      })
    } catch(err) {
      console.warn(err.message)
      setLoading(false)
    }
  }, [offset])

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{position: 'fixed', left: 20, top: 20, zIndex: 100}}>
        <ThemeProvider theme={theme}>
        <IconButton
          color='default' 
          aria-label='home'
          onClick={_ => history.push({ pathname: '/' })}
        >
          <Rotate>
            <HomeIcon />
          </Rotate>
        </IconButton>
        </ThemeProvider>
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {loading ? <div style={{marginTop: 20}}><ScaleLoader color='orange'/><p style={{ fontSize: '16px'}}>please wait, loading from kafka... <Timer /></p></div> :
          <table style={{ flex: 1 }}>
            <thead>
              <tr>
                <th style={{borderBottom: '1px solid #999' }}>topic</th>
                <th style={{borderBottom: '1px solid #999' }}>partition</th>
                <th style={{borderBottom: '1px solid #999', display: 'flex' }}>
                  <Tooltip title={offset - 1 > 0 ? offset - 1 : 0} placement='left-start'>
                    <ArrowLeftIcon
                      onClick={_ => setOffset(offset - 1 > 0 ? offset - 1 : 0)}
                      style={{cursor: 'pointer'}}
                    />
                  </Tooltip>
                  offset
                  <Tooltip title={Number(offset) + 1} placement='right-start'>
                    <ArrowRightIcon
                      onClick={_ => setOffset(Number(offset) + 1)}
                      style={{cursor: 'pointer'}}
                    />
                  </Tooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{topic}</td>
                <td>{partition}</td>
                <td>{offset}</td>
              </tr>
            </tbody>
          </table>
          }
          <div style={{ flex: 1 }}>
            {loading || 
              <div>
                <table>
                  <thead>
                    <tr>
                      <th style={{borderBottom: '1px solid #999' }}>raw message</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Grow in={true}>
                          <Paper elevation={3}>
                            <pre style={pre}>
                              {JSON.stringify(messageObj, null, 2)}
                            </pre>
                          </Paper>
                        </Grow>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

const pre = {
  padding: '10px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: 'bold',
  background: '#eee',
  borderRadius: '5px'
}

export default Details
