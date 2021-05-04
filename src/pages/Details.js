import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ScaleLoader } from 'react-spinners'
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'
import BackspaceIcon from '@material-ui/icons/Backspace';
import Timer from '../components/Timer'

const Details = props => {

  const [ messageObj, setMessageObj ] = useState({})
  const [ loading, setLoading ] = useState(false)
  const { topic, partition, offset } = props.match.params
  const history = useHistory()

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
      })
    } catch(err) {
      console.warn(err.message)
      setLoading(false)
    }
  }, [])

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: 20, top: 20}}>
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
          onClick={_ => window.open('/', '_self')}
          color='default'
          size='small'
        >home
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
                <th style={{borderBottom: '1px solid #999' }}>offset</th>
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
