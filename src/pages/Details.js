import React from 'react'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { ScaleLoader } from 'react-spinners'
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'
import BackspaceIcon from '@material-ui/icons/Backspace'
import SearchIcon from '@material-ui/icons/Search'
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import Tooltip from '@material-ui/core/Tooltip'
import Timer from '../components/Timer'

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
      {
        history.location.state ?
        <Button
          variant='outlined'
          onClick={_ => history.goBack()}
          color='default'
          size='small'
          startIcon={<BackspaceIcon />}
        >back
        </Button> :
        <Button
          variant='outlined'
          onClick={_ => history.push({ pathname: '/' })}
          color='default'
          size='small'
          startIcon={<SearchIcon />}
          >search
        </Button>
      }
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {loading ? <div><ScaleLoader color='orange'/><p style={{ fontSize: '16px'}}>please wait, loading from kafka... <Timer /></p></div> :
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
                      <pre style={pre}>
                        {JSON.stringify(messageObj, null, 2)}
                      </pre>
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
