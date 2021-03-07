import { useState, useEffect } from 'react'
import './App.css'
import { TextField } from '@material-ui/core'
import axios from 'axios'
import Lister from './components/Lister'

function App() {

  const [query, setQuery] = useState('')
  const [data, setData] = useState([])

  const onChange = async evt => setQuery(evt.target.value)

  useEffect(async _ => {
    if (query) {
      try {
        await axios.post('http://localhost:3334/api/v1/search/', {
          search: query
        }, {
          mode: 'no-cors'
        })
        .then(res => {
          setData(res.data)
        })        
      } catch(err) {
        console.warn(err.message)
        setData([])
      }
    } else {
      setData([])
    }
  }, [query])

  return (
    <div className="App">
      <header className="App-header">
      <TextField
        variant='outlined'
        onChange={onChange}
        value={query}
        color='primary'
        type='search'
        label='search'
        placeholder='...'
      /> {/* text color in App.css: input */}
        <Lister data={data} />
      </header>
    </div>
  )

}

export default App
