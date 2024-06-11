import AddNewUser from '../../../../components/dashboard/addNewUser/AddNewUser'
import axios from 'axios'
import React from 'react'
const fetchData = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}`
    )
    const data = await response.json()
    if (response.status !== 200) {
      throw new Error('Failed to fetch user')
    }

    return data
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch user')
  }
}
const SingleUserPage = async ({ params }) => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null

  const user = await fetchData(params.id)
  return <AddNewUser singleUser={user} admin={true} />
}

export default SingleUserPage
