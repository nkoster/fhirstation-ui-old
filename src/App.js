import { useState, useEffect } from 'react'
import './App.css'
import { TextField } from '@material-ui/core'

function App() {

  const [query, setQuery] = useState('')
  const [data, setData] = useState([])

  const onChange = async evt => setQuery(evt.target.value)

  useEffect(async _ => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${query}`)
      .then(res => res.json())
      console.log('RESPONSE',response)
    setData(response)
  }, [query])

  return (
    <div className="App">
      <header className="App-header">
      <TextField
        onChange={onChange}
        value={query}
        color='primary'
        type='search'
        label='search'
        placeholder='...'
      /> {/* text color in App.css: input */}
      <ul>
        {Array.isArray(data) ? data.map(d => <li key={d.title}>{d.title}</li>) : data.title ? <li>{data.title}</li> : <li>nothing here...</li>}
        </ul>
      </header>
    </div>
  )

}

export default App
