import { unstable_noStore as noStore } from 'next/cache'
import Navbar from '../../../components/navbar/Navbar'
import Footer from '../../../components/footer/Footer'
import SingleProduct from '../../../components/singleProduct/SingleProduct'

const fetchData = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`
    )
    const data = await response.json()
    if (response.status !== 200) {
      throw new Error('Failed to fetch product')
    }

    return data
  } catch (error) {
    console.log(error.message)
    throw new Error('Failed to fetch product')
  }
}
const SingleItmePage = async ({ params }) => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null
  noStore()
  const { prodId } = params
  const singleProduct = await fetchData(prodId)
  return (
    <>
      <Navbar />
      <SingleProduct data={singleProduct} />
      <Footer />
    </>
  )
}

export default SingleItmePage
