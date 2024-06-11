import { unstable_noStore as noStore } from 'next/cache'

import Orders from '../../../components/dashboard/orders/Orders'

import React from 'react'
const fetchData = async (query, page) => {
  try {
    noStore()
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SERVER_URL
      }/api/orders?query=${query}&page=${+page}`
    )
    const data = await response.json()

    if (response.status !== 200) {
      throw new Error('Failed to fetch orders')
    }

    return data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch orders')
  }
}
const OrdersPage = async ({ searchParams }) => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null
  noStore()
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
