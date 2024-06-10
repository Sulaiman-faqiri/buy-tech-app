'use client'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ref, deleteObject } from 'firebase/storage'
import { storage } from '../../../lib/firebaseConfig'
import './Categories.scss'

const Categories = ({ categories }) => {
  const router = useRouter()

  const handleDelete = async (id, name) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/categories/${id}`
      )

      if (response.status === 200) {
        router.refresh('/dashboard/categories')
        toast.success(response.data.message)
        const productsResponse = await axios.get(
          `http://localhost:3000/api/products`
        )
        const products = productsResponse.data

        // Filter products belonging to the deleted category
        const productsToDelete = products.filter((item) => item.category === id)

        // Delete images from Firebase Storage for each product
        for (const product of productsToDelete) {
          for (const image of product.images) {
            if (image.src && !image.file) {
              const storageRef = ref(storage, `images/${image.name}`)
              await deleteObject(storageRef)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending data to backend:', error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <>
      <div className='categoryPage'>
        <div className='top'>
          <h2>Categories</h2>
          <Link href={'/dashboard/categories/add'}>
            <button>Add New Category</button>
          </Link>
        </div>

        <div className='categoryBox'>
          {categories?.length > 0 ? (
            categories?.map((item) => {
              return (
                <div className='categoryItem' key={item._id}>
                  <div className='info'>
                    <div>{item.name}</div>
                    <p>{item.description}</p>
                  </div>
                  <button onClick={() => handleDelete(item._id, item.name)}>
                    Delete
                  </button>
                </div>
              )
            })
          ) : (
            <h2>NO category found.</h2>
          )}
        </div>
      </div>
    </>
  )
}

export default Categories
