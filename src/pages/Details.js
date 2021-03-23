import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ScaleLoader } from 'react-spinners'
// import { cancelTokenSource } from 'axios'
import './Details.css'

const Details = props => {

  const [ data, setData ] = useState({})
  const [ message, setMessage ] = useState('')
  const [ messageObj, setMessageObj ] = useState({})
  const [ loading, setLoading ] = useState(false)
  const { topic, offset } = props.match.params
  // const { identifierType } = props.location.state || {}
  // const { identifierValue } = props.location.state || {}

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
        // setMessage(JSON.stringify(res.data.message))
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
          <h2 style={{ flex: 1 }}>{topic} / {offset}</h2>
          {loading ? <div><ScaleLoader color='orange'/><br />please wait, loading from kafka...</div> :
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
          <div style={{ flex: 1, marginTop: 20 }}>
            {loading || 
              <div>
                <h4>raw message value:</h4>
                <pre style={pre}>
                  {JSON.stringify(messageObj, null, 2)}
                </pre>
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
  fontSize: '14px',
  fontWeight: 'bold'
}

export default Details
