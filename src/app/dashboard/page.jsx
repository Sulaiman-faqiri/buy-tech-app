import axios from 'axios'
import Overview from '../../components/dashboard/overview/Overview'
const fetchData = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/dashboard`)

    if (response.status !== 200) {
      throw new Error('Failed to fetch overview information')
    }

    return response.data
  } catch (error) {
    console.log(error.message)
    throw new Error('Failed to fetch overview information')
  }
}
const OverViewPage = async () => {
  const data = await fetchData()

  return (
    <>
      <Overview data={data} />
    </>
  )
}

export default OverViewPage
