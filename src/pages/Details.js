import React from 'react'

const Details = ({ match }) => {
  const { topic, offset } = match.params
  return (
    <div style={{display: 'flex', justifyContent: 'center', height: '94vh'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div>
          Jetzt geht's Los!
          <h2>{topic}</h2>
          <h2>{offset}</h2>
        </div>
      </div>
    </div>
  )
}

export default Details
