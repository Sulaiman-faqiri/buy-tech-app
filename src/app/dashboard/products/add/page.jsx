import { unstable_noStore as noStore } from 'next/cache'

import AddNewProduct from '../../../../components/dashboard/addNewProduct/AddNewProduct'
import Link from 'next/link'
const fetchData = async () => {
  try {
    noStore()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`
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

const AddProduct = async () => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null
  noStore()
  const categories = await fetchData()
  return (
    <>
      {!categories?.length < 1 && <AddNewProduct categories={categories} />}
      {categories?.length < 1 && (
        <>
          <h2>Please first add a Category</h2>
          <Link
            href={'/dashboard/categories/add'}
            style={{ textDecoration: 'underline', color: 'var(--blue1)' }}
          >
            Add new Category?
          </Link>
        </>
      )}
    </>
  )
}

export default AddProduct
