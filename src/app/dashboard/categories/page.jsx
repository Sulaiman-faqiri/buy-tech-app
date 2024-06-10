import axios from 'axios'
import Categories from '../../../components/dashboard/category/Categories'
const fetchData = async () => {
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
const CategoriesPage = async () => {
  const categories = await fetchData()
  return (
    <>
      <Categories categories={categories} />
    </>
  )
}

export default CategoriesPage
