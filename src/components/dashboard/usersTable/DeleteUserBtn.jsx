'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const DeleteUserBtn = ({ _id, image }) => {
  const router = useRouter()
  const deleteUser = async (id) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}`
    )
    if (response.status === 200) {
      router.refresh('/dashboard/users')
      toast.success('User deleted successfully')
      if (image.src) {
     
        await fetch('/api/upload/delete', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: image.src,
  }),
})
      }
    }
    if (response.status === 404) toast.error('user not found.')
    if (response.status === 500) toast.error('Failed to delete user')
  }
  return (
    <button className='delete' onClick={() => deleteUser(_id)}>
      Delete
    </button>
  )
}

export default DeleteUserBtn
