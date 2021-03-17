import React from 'react'

const Details = props => {
  const { topic, offset } = props.match.params
  const { identifierType } = props.location.state || {}
  const { identifierValue } = props.location.state || {}
  return (
    <div style={{display: 'flex', justifyContent: 'center', height: '94vh'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div>
          Jetzt geht's Los!
          <h2>{topic}</h2>
          <h2>{offset}</h2>
          <h2>{identifierType}</h2>
          <h2>{identifierValue}</h2>
        </div>
      </div>
    </div>
  )
}

export default Details
