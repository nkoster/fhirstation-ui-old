import './App.css'
import Home from './pages/Home'
import { useRef, useEffect, useState } from 'react'
import fhirDepartment1 from './pix/fire1.png'

const App = _ => {
  const [loading, setLoading] = useState(true)
  const img1 = useRef()
  useEffect(_ => {
    setTimeout(_ => {
      img1.current.style.height = '0px'
      setTimeout(_ => {
        img1.current.style.display = 'none'
        setLoading(false)
    }, 700)
    }, 500)
  }, [])
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <img ref={img1} style={fire1Style} src={fhirDepartment1} alt='FHIR department' />
      </div>
      {loading ? null : <Home />}
    </>
  )
}

const fire1Style = {
  padding: 0, margin: 0,
  height: 300,
  transition: 'height 0.7s'
}

export default App
