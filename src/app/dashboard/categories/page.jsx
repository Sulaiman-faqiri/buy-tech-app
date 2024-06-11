import Categories from '../../../components/dashboard/category/Categories'
const fetchData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`,
      { cache: 'no-store' }
    )
    const res = await response.json()
    if (response.status !== 200) {
      throw new Error('Failed to fetch categories')
    }
    return res
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
