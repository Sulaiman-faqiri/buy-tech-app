import { unstable_noStore as noStore } from 'next/cache'

import AddNewCategory from '../../../../components/dashboard/addNewCategory/AddNewCategory'

const AddNewCategoryPage = () => {
  noStore()
  return <AddNewCategory />
}

export default AddNewCategoryPage
