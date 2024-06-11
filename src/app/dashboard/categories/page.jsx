import { unstable_noStore as noStore } from 'next/cache'

import Categories from '../../../components/dashboard/category/Categories'
const fetchData = async () => {
  try {
    noStore()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`
    )
    const data = await response.json()
    if (response.status !== 200) {
      throw new Error('Failed to fetch categoriess')
    }
    return data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch categories')
  }
}
const CategoriesPage = async () => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null
  noStore()
  const categories = await fetchData()
  return (
    <>
      <Categories categories={categories} />
    </>
  )
}

export default CategoriesPage
