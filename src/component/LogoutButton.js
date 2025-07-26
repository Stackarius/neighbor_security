import React from 'react'
import { LogOutIcon } from 'lucide-react'
import { logout } from '@/lib/auth'
import { toast } from 'react-toastify'

const LogoutButton = () => {

    const handleLogout = async () => {
        await logout()
    }
  return (
    <button
            onClick={() => {
              handleLogout()
              toast.success("Logout successful");
            }}
            className="inline-flex text-white items-center font-bold px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-center"
          >
            <LogOutIcon className="h-4 w-4 mr-3" /> Logout
          </button>
  )
}

export default LogoutButton