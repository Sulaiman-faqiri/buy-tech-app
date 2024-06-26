import { unstable_noStore as noStore } from 'next/cache'

import UserOrders from '../../../components/userOrders/UserOrders'
import Link from 'next/link'

const fetchData = async (userId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${userId}`
    )
    const data = await response.json()
    if (response.status !== 200) {
      throw new Error('Failed to fetch orders')
    }

    return data
  } catch (error) {
    console.error(error.message)
    throw new Error('Failed to fetch orders')
  }
}

const UserOrdersPage = async ({ params }) => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null
  noStore()
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
