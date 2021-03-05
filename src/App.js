import { useState, useEffect } from 'react'
import './App.css'
import { TextField } from '@material-ui/core'
import axios from 'axios'

function App() {

  const [query, setQuery] = useState('')
  const [data, setData] = useState([])

  const onChange = async evt => setQuery(evt.target.value)

  useEffect(async _ => {
    if (query) {
      await axios.post('http://localhost:3334/api/v1/search/', {
        search: query
      }, {
        mode: 'no-cors'
      })
      .then(res => {
        setData(res.data)
      })
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
      <ul>
        {Array.isArray(data) ? data.map(d => <li key={d.identifier_value}>{d.identifier_value}</li>) : data ? <li>{data}</li> : <li>nothing here...</li>}
        </ul>
      </header>
    </div>
  )

}

export default App
