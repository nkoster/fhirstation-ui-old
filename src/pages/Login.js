import { useState, useRef, useEffect } from 'react'
import { setCookie } from '../utils/cookies'
import { TextField, ThemeProvider, createMuiTheme } from '@material-ui/core'
import { green, orange } from '@material-ui/core/colors'
import IconButton from '@material-ui/core/IconButton'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import fhirDepartment1 from '../pix/fire1.png'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[800],
    },
    secondary: {
      main: green[800]
    }
  }
})

const Login = ({getTokens}) => {

  const img1 = useRef()

  const [loading, setLoading] = useState(true)

  useEffect(_ => {
    setTimeout(_ => {
      img1.current.style.height = '80px'
    }, 500)
  }, [])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(false)

  const onChangeUsername = evt => setUsername(evt.target.value)
  const onChangePassword = evt => setPassword(evt.target.value)

  const onLogin = async evt => {
    evt.preventDefault()
    const res = await fetch('https://auth.w3b.net/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username, password
      })
    })
    const tokens = await res.json()
    if (tokens.error) {
      setErr(true)
      return
    }
    tokens.username = username
    setCookie('tokens', JSON.stringify(tokens), 1800)
    getTokens(tokens)
  }

  return (
    <div className='App'>
      <p>FHIR Station Login</p>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <img ref={img1} style={fire1Style} src={fhirDepartment1} alt='FHIR department' />
      </div>
      {err ? <h3 className='pp'>No Way! (:</h3> : null}
      <form onSubmit={onLogin} >
      <ThemeProvider theme={theme}>
        <TextField
          style={{ flex: '0.7', margin: 10 }}
          margin='dense'
          variant='standard'
          onChange={onChangeUsername}
          value={username}
          color='primary'
          type='text'
          label='Username'
          spellCheck={false}
        /> {/* text color in App.css: input */}
        <TextField
          style={{ flex: '0.7', margin: 10 }}
          margin='dense'
          variant='standard'
          onChange={onChangePassword}
          value={password}
          color='primary'
          type='password'
          placeholder=''
          label='Password'
          spellCheck={false}
        /> {/* text color in App.css: input */}
      </ThemeProvider>
      <ThemeProvider theme={theme}>
        <IconButton
          color='secundary'
          aria-label='login'
          style={{width: 60, height: 60}}
          type='submit'
          // onClick={onLogin}
        >
          <ExitToAppRoundedIcon style={{width: 36, height: 36}} />
        </IconButton>
        </ThemeProvider>
      </form>
    </div>
  )
}

const fire1Style = {
  padding: 0, margin: 0,
  height: 0,
  transition: 'height 0.7s'
}

export default Login
