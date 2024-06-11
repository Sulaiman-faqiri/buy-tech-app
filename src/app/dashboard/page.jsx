import Overview from '../../components/dashboard/overview/Overview'
import { unstable_noStore as noStore } from 'next/cache'

const fetchData = async () => {
  noStore()
  try {
    const time = new Date().getTime()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/dashboard?timestamp=${time}`
    )
    const data = await response.json()
    if (response.status !== 200) {
      throw new Error('Failed to fetch overview information')
    }

    return data
  } catch (error) {
    console.log(error.message)
    throw new Error('Failed to fetch overview information')
  }
}
const OverViewPage = async () => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) return null
  noStore()
  const data = await fetchData()

  return (
    <>
      <Overview data={data} />
    </>
  )
}

export default OverViewPage
