import axios from 'axios'
import Categories from '../../../components/dashboard/category/Categories'
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
const CategoriesPage = async () => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null

  const categories = await fetchData()
  return (
    <>
      <Categories categories={categories} />
    </>
  )
}

export default CategoriesPage
