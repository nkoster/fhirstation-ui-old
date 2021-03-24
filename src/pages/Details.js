import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ScaleLoader } from 'react-spinners'
import { cancelTokenSource } from 'axios'
import './Details.css'

const Details = props => {

  const [ data, setData ] = useState({})
  const [ message, setMessage ] = useState('')
  const [ messageObj, setMessageObj ] = useState({})
  const [ loading, setLoading ] = useState(false)
  const { topic, offset } = props.match.params

  useEffect(async _ => {
    try {
      setLoading(true)
      await axios.post('https://offset.fhirstation.net/api/v1/kafka/', {
        // cancelToken: cancelTokenSource.token,
        topic, offset
      }, {
        mode: 'no-cors'
      })
      .then(res => {
        setData(res.data)
        setMessage(JSON.stringify(res.data.message))
        setMessageObj(JSON.parse(res.data.message.value))
        setLoading(false)
      })
    } catch(err) {
      console.warn(err.message)
      setLoading(false)
    }
  }, [])

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ flex: 1 }}>{topic} / {offset}</h3>
          {loading ? <div><ScaleLoader color='orange'/><p>please wait, loading from kafka...</p></div> :
          <table style={{ flex: 1 }}>
            <thead>
              <tr>
                <th style={{borderBottom: '1px solid #999' }}>key</th>
                <th style={{borderBottom: '1px solid #999' }}>partition</th>
                <th style={{borderBottom: '1px solid #999' }}>offset</th>
                <th style={{borderBottom: '1px solid #999' }}>highWatermark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data?.message?.key}</td>
                <td>{data.partition}</td>
                <td>{data?.message?.offset}</td>
                <td>{data.highWatermark}</td>
              </tr>
            </tbody>
          </table>}
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
