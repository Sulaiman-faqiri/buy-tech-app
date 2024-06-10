import UsersTable from '../../../components/dashboard/usersTable/UsersTable'
import React from 'react'
const fetchData = async (query, page) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/users?query=${query}&page=${+page}`,
      { cache: 'no-store' }
    )
    const res = await response.json()

    if (response.status !== 200) {
      throw new Error('Failed to fetch users')
    }

    return res
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch users')
  }
}

const UsersPage = async ({ searchParams }) => {
  const query = searchParams?.q || ''
  const page = searchParams?.page || 1
  const { ITEM_PER_PAGE, count, users } = await fetchData(query, page)

  return (
    <>
      <UsersTable users={users} count={count} ITEM_PER_PAGE={ITEM_PER_PAGE} />
    </>
  )
}

export default UsersPage
