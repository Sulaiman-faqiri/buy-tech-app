import axios from 'axios'
import Orders from '../../../components/dashboard/orders/Orders'

import React from 'react'
const fetchData = async (query, page) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/orders?query=${query}&page=${+page}`,
      { cache: 'no-store' }
    )

    if (response.status !== 200) {
      throw new Error('Failed to fetch orders')
    }

    return response.data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch orders')
  }
}
const OrdersPage = async ({ searchParams }) => {
  const query = searchParams?.q || ''
  const page = searchParams?.page || 1
  const { ITEM_PER_PAGE, count, orders } = await fetchData(query, page)
  return (
    <>
      <Orders data={orders} count={count} ITEM_PER_PAGE={ITEM_PER_PAGE} />
    </>
  )
}

export default OrdersPage
