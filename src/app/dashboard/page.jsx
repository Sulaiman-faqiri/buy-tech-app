import Overview from '../../components/dashboard/overview/Overview'
export const dynamic = 'force-dynamic'
const fetchData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/dashboard`
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

  const data = await fetchData()

  return (
    <>
      <Overview data={data} />
    </>
  )
}

export default OverViewPage
