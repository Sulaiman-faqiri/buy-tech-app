// import Sidebar from '@/components/dashboard/sidebar/Sidebar'
import Sidebar from '../../components/dashboard/sidebar/Sidebar'

const layout = ({ children }) => {
  return (
    <>
      <Sidebar>{children}</Sidebar>
    </>
  )
}

export default layout
