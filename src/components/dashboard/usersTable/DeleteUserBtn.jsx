'use client'
// import { storage } from '@/components/utils/firebaseConfig'
import { storage } from '../../../lib/firebaseConfig'
import axios from 'axios'
import { deleteObject, ref } from 'firebase/storage'
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
        const storageRef = ref(storage, `images/${image.name}`)
        await deleteObject(storageRef)
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
