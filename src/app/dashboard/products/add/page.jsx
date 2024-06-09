import axios from 'axios'
import AddNewProduct from '../../../../components/dashboard/addNewProduct/AddNewProduct'
import Link from 'next/link'
const fetchData = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`,
      { cache: 'no-store' }
    )

    if (response.status !== 200) {
      throw new Error('Failed to fetch categories')
    }

    return response.data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch categories')
  }
}
const AddProduct = async () => {
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
