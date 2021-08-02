import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import { getCookie } from './utils/cookies'
import { useEffect, useState } from 'react'

const App = _ => {

  const [Tokens, setTokens] = useState({})

  const getTokens = tokens => setTokens(tokens)

  useEffect(_ => {
    const cookie = getCookie('tokens')
    if (!cookie) return
    const tokens = JSON.parse(cookie)
    if (tokens) setTokens(tokens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!Tokens.accessToken) return <Login getTokens={getTokens} />

  return <Home accesToken={Tokens.accessToken} setTokens={setTokens} />

}

export default App
