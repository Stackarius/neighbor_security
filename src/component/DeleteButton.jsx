import { Trash2 } from 'lucide-react'
import React from 'react'

const DeleteButton = ({click}) => {
    return (
        <button onClick={click} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200">
            <Trash2 className='cursor-pointer inline mr-1'/> Delete
      </button>
  )
}

export default DeleteButton