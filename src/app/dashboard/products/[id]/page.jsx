import { unstable_noStore as noStore } from 'next/cache'

import EditProduct from '../../../../components/dashboard/editProduct/EditProduct'
import React from 'react'
const fetchData = async (id) => {
  try {
    noStore()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`
    )
    const data = await response.json()
    if (response.status !== 200) {
      throw new Error('Failed to fetch products')
    }

    return data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch products')
  }
}
const fetchCategories = async () => {
  try {
    noStore()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`,
      { cache: 'no-store' }
    )
    const data = await response.json()
    if (response.status !== 200) {
      throw new Error('Failed to fetch categories')
    }

    return data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch categories')
  }
}

const EditSingleProduct = async ({ params }) => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null
  noStore()
  const { id } = params
  const data = await fetchData(id)
  const categories = await fetchCategories()
  return (
    <>
      <EditProduct
        editData={data}
        editMode={true}
        prodId={id}
        categories={categories}
      />
    </>
  )
}

export default EditSingleProduct
