'use client'
import { storage } from '../../../lib/firebaseConfig'
import axios from 'axios'
import { deleteObject, ref } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const DeleteProductBtn = ({ _id, images }) => {
  const router = useRouter()
  const deleteProduct = async (id) => {
    const response = await axios.delete(
      `http://localhost:3000/api/products/${id}`
    )
    if (response.status === 200) {
      router.refresh('/dashboard/products')
      toast.success('Product deleted successfully')
      await Promise.all(
        images.map(async (removedImage) => {
          if (removedImage.src) {
            const storageRef = ref(storage, `images/${removedImage.name}`)
            await deleteObject(storageRef)
          }
        })
      )
    }
    if (response.status === 404) toast.error('Product not found.')
    if (response.status === 500) toast.error('Failed to delete product')
  }
  return (
    <button className='delete' onClick={() => deleteProduct(_id)}>
      Delete
    </button>
  )
}

export default DeleteProductBtn
