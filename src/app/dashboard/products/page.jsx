import { unstable_noStore as noStore } from 'next/cache'

import ProductsTable from '../../../components/dashboard/productsTable/ProductsTable'
const fetchData = async (query, page) => {
  try {
    noStore()
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SERVER_URL
      }/api/products?query=${query}&page=${+page}`,
      { cache: 'no-store' }
    )
    const res = await response.json()

    if (response.status !== 200) {
      throw new Error('Failed to fetch products')
    }

    return res
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch products')
  }
}
const ProductsPage = async ({ searchParams }) => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null
  noStore()
  const query = searchParams?.q || ''
  const page = searchParams?.page || 1
  const { ITEM_PER_PAGE, count, products } = await fetchData(query, page)

  return (
    <>
      <ProductsTable
        data={products}
        count={count}
        ITEM_PER_PAGE={ITEM_PER_PAGE}
      />
    </>
  )
}

export default ProductsPage
