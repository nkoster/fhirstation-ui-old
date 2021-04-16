import React, { useRef, useEffect, useState } from 'react'

const Timer = _ => {

  const [num, setNum] = useState(Date.now())

  let intervalRef = useRef()

  const increaseNum = _ => {
    setNum(Date.now() - num)
  }
  
  useEffect(_ => {
    setNum(Date.now())
    intervalRef.current = setInterval(increaseNum, 10)
    return _ => clearInterval(intervalRef.current)
  }, [])

  return (
    <span style={{color: '#aaa'}}>
      ({(Math.floor(num / 10) / 100).toFixed(2)}s)
    </span>
  )

}

export default Timer
