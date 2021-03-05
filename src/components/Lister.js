import React from 'react'
import { DataGrid } from '@material-ui/data-grid'

const Lister = ({data}) => {
    return (
        <div className='list'>
        {Array.isArray(data) ? data.map(d => 
          <div key={d.identifier_value}>{d.identifier_value}</div>
        ) : data ? <div>{data}</div> : <div>nothing here...</div>}
      </div>
    )
}
export default Lister
