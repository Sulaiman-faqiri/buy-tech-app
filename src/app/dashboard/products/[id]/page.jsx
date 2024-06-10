import EditProduct from '../../../../components/dashboard/editProduct/EditProduct'
import axios from 'axios'
import React from 'react'
const fetchData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/products/${id}`)

    if (response.status !== 200) {
      throw new Error('Failed to fetch products')
    }

    return response.data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch products')
  }
}
const fetchCategories = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/categories`, {
      cache: 'no-store',
    })

    if (response.status !== 200) {
      throw new Error('Failed to fetch categories')
    }

    return response.data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch categories')
  }
}

const EditSingleProduct = async ({ params }) => {
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
