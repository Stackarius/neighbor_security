import { Trash2 } from 'lucide-react'
import React from 'react'

const DeleteButton = ({click}) => {
    return (
        <button onClick={click}>
            <Trash2 color='red' className='cursor-pointer'/>
      </button>
  )
}

export default DeleteButton