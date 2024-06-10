import Navbar from '../../../components/navbar/Navbar'
import Footer from '../../../components/footer/Footer'
import SingleProduct from '../../../components/singleProduct/SingleProduct'
import axios from 'axios'
const fetchData = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`
    )

    if (response.status !== 200) {
      throw new Error('Failed to fetch product')
    }

    return response.data
  } catch (error) {
    console.log(error.message)
    throw new Error('Failed to fetch product')
  }
}
const SingleItmePage = async ({ params }) => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null

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
