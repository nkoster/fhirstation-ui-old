import React from 'react'
import { DataGrid } from '@material-ui/data-grid'

const columns = [
  { field: 'kafka_topic', headerName: 'Kafka Topic', width: '200px' },
  { field: 'kafka_offset', headerName: 'Kafka Offset', width: '200px' },
  { field: 'identifier_type', headerName: 'Type', width: '200px' },
  { field: 'identifier_value', headerName: 'Value', width: '200px' }
]

const Lister = ({data}) => {
  return (
    // <div style={{ height: 500, width: '100%' }}>
    //   <DataGrid hideFooter rows={data} columns={columns} />
    // </div>
    <div className='list'>
      {Array.isArray(data) ? data.map(d => 
        <div key={d.identifier_value}>{d.identifier_value}</div>
      ) : data ? <div>{data}</div> : <div>nothing here...</div>}
    </div>
  )
}

export default Lister
