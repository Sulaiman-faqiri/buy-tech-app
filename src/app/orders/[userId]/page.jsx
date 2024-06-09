import axios from 'axios'
import UserOrders from '../../../components/userOrders/UserOrders'
import Link from 'next/link'

const fetchData = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${userId}`
    )

    if (response.status !== 200) {
      throw new Error('Failed to fetch orders')
    }

    return response.data
  } catch (error) {
    console.error(error.message)
    throw new Error('Failed to fetch orders')
  }
}

const UserOrdersPage = async ({ params }) => {
  const orders = await fetchData(params.userId)

  return (
    <>
      {orders?.length > 0 && <UserOrders orders={orders} />}
      {orders?.length < 1 && (
        <>
          <h2
            style={{
              marginTop: '40px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            No orders found.
            <Link
              style={{
                marginTop: '40px',
                width: '100%',
                textAlign: 'center',
                display: 'block',
              }}
              href={'/'}
            >
              Go back Home
            </Link>
          </h2>
        </>
      )}
    </>
  )
}

export default UserOrdersPage
